<script lang="ts">
    import type { EffectComposerProps } from "./types";
    import { onMount } from "svelte";
    import {
        type Camera,
        HalfFloatType,
        Group,
        NoToneMapping,
    } from "three";
    import { T } from "@threlte/core";
    import { useTask, useThrelte } from "@threlte/core";
    import { isWebGL2Available } from "three-stdlib";
    import {
        DepthDownsamplingPass,
        EffectComposer,
        NormalPass,
        RenderPass,
        Effect,
        Pass,
        EffectPass
    } from "postprocessing";
    import { isConvolution } from "./utils";
    import { createEffectComposerContext } from "./context";

    let {
        children,
        camera: _camera,
        scene: _scene,
        resolutionScale,
        enabled = true,
        renderPriority = 1,
        autoClear = true,
        depthBuffer,
        enableNormalPass,
        stencilBuffer,
        multisampling = 8,
        frameBufferType = HalfFloatType,

        id,

        ref: effectComposer = $bindable(null)
    }: EffectComposerProps & {
        ref?: EffectComposer | null;
    } = $props();

    const { renderer, scene: defaultScene, camera: defaultCamera, size, autoRender, renderStage, invalidate } = useThrelte();

    // let effectComposer = $state<EffectComposer | null>(null);
    let downSamplingPass = $state<DepthDownsamplingPass | null>(null);
    let normalPass = $state<NormalPass | null>(null);
    let groupRef = $state<Group>();
    let items = $state<(Pass | Effect)[]>([]);

    let scene = $derived(_scene ?? defaultScene);

    const context = createEffectComposerContext({
        composer: effectComposer,
        normalPass: null,
        downSamplingPass: null,
        scene: null,
        camera: null,

        push(item: Effect | Pass): number {
            console.log("PUSH ITEM");
            return items.push(item);
        },

        remove(item: Effect | Pass) {
            const index = items.indexOf(item);

            if (index != -1)
                items.splice(index, 1);
        },

        removeByIndex(index: number) {
            if (index != -1)
                items.splice(index, 1);
        },

        disposeByIndex(index: number) {
            if (index > items.length)
                items[index].dispose();
        },

        render() {
            invalidate();
        }
    }, id);

    function setupEffectComposer(camera: Camera) {
        console.log("SETUP EFFECT COMPOSER");
        effectComposer?.removeAllPasses();

        const webGL2Available = isWebGL2Available();

        effectComposer = new EffectComposer(renderer, {
            depthBuffer,
            stencilBuffer,
            multisampling: multisampling > 0 && webGL2Available ? multisampling : 0,
            frameBufferType,
        });

        effectComposer.addPass(new RenderPass(scene, camera));

        if (enableNormalPass) {
            normalPass = new NormalPass(scene, camera);
            normalPass.enabled = false;

            effectComposer.addPass(normalPass);

            if (resolutionScale !== undefined && webGL2Available) {
                downSamplingPass = new DepthDownsamplingPass({ normalBuffer: normalPass.texture, resolutionScale });
                downSamplingPass.enabled = false;

                effectComposer.addPass(downSamplingPass);
            }
        }
    }

    onMount(() => {
        setupEffectComposer(_camera ?? $defaultCamera);

        const unsub = size.subscribe(value => {
            console.log("SET SIZE");
            effectComposer?.setSize(value.width, value.height);
        });

        return () => {
            unsub();
        }
    });

    useTask(delta => {
        if (enabled) {
            const currentAutoClear = renderer.autoClear;
            renderer.autoClear = autoClear;

            if (stencilBuffer && !autoClear)
                renderer.clearStencil();

            // console.log("RENDER");
            // console.log("RENDER", effectComposer, delta);
            effectComposer?.render(delta);
            renderer.autoClear = currentAutoClear;
        }
    }, { stage: renderStage, autoInvalidate: false });

    $effect(() => {
        // setupEffectComposer(_camera ?? $defaultCamera);
    });

    $effect(() => {
        const passes: Pass[] = []
        console.log($state.snapshot(items));
        if (effectComposer) {
            for (let i = 0; i < items.length; i++) {
                const child = items[i]

                if (child instanceof Effect) {
                    const effects: Effect[] = [child]

                    if (!isConvolution(child)) {
                        let next: unknown = null
                        while ((next = items[i + 1]) instanceof Effect) {
                            if (isConvolution(next)) break
                            effects.push(next)
                            i++
                        }
                    }

                    const pass = new EffectPass(_camera ?? $defaultCamera, ...effects)
                    passes.push(pass)
                } else {
                    passes.push(child)
                }
            }

            for (const pass of passes) effectComposer?.addPass(pass)

            if (normalPass) normalPass.enabled = true
            if (downSamplingPass) downSamplingPass.enabled = true
        }

        return () => {
            for (const pass of passes) effectComposer?.removePass(pass)
            if (normalPass) normalPass.enabled = false
            if (downSamplingPass) downSamplingPass.enabled = false
        }
    });

    $effect(() => {
        console.log("UPDATE CONTEXT ");
        context.update(value => {
            value.camera = _camera ?? $defaultCamera;
            value.scene = _scene ?? defaultScene;
            value.downSamplingPass = downSamplingPass;
            value.normalPass = normalPass;
            value.composer = effectComposer;

            return value;
        });
    })


    $effect(() => {
        return () => {
            console.log("REMOVE");
            effectComposer?.removeAllPasses()
            effectComposer?.dispose()
        }
    })

    $effect(() => {
        console.log("AUTO RENDER");
        const last = autoRender.current
        autoRender.set(false)
        return () => {
            autoRender.set(last)
        }
    })

    $effect(() => {
        console.log("TONE MAPPING");
        const currentTonemapping = renderer.toneMapping
        renderer.toneMapping = NoToneMapping;

        return () => {
            renderer.toneMapping = currentTonemapping
        }
    })
</script>

<T.Group bind:ref={groupRef}>
    {@render children?.()}
</T.Group>

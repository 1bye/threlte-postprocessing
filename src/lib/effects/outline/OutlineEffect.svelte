<script lang="ts">
    import type { OutlineEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { OutlineEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";
    import { Color } from "three";
    import { getSelectionContext } from "../../selection/context";

    let {
        composerId,
        camera,
        scene,
        selectionLayer = 10,
        ...props
    }: EffectProps<OutlineEffectProps> = $props();

    const selectionContext = getSelectionContext();
    const context = getEffectComposerContext(composerId);
    const _effect = new OutlineEffect(scene ?? $context.scene ?? undefined, camera ?? $context.camera ?? undefined, props);

    onMount(() => {
        tick().then(() => {
            $context.push(_effect);
        });

        return () => {
            _effect.dispose();
        };
    });

    $effect(() => {
        if ($selectionContext.enabled) {
            if ($selectionContext.selected?.length) {
                _effect.selection.set($selectionContext.selected);
                $context.render();

                return () => {
                    _effect.selection.clear();

                    $context.render();
                }
            }
        }
    });

    $effect(() => {
        if (selectionLayer !== undefined) {
            _effect.selectionLayer = selectionLayer;

            $context.render();
        }
    })

    $effect(() => {
        const {
            blendFunction,
            patternTexture,
            width,
            resolutionY,
            resolutionScale,
            resolutionX,
            height,
            kernelSize,
            hiddenEdgeColor,
            edgeStrength,
            multisampling,
            patternScale,
            visibleEdgeColor,
            xRay,
            pulseSpeed,
            blur
        } = props;

        width && height && _effect.setSize(width, height);

        if (resolutionScale !== undefined)
            _effect.setResolutionScale(resolutionScale);

        if (resolutionX && resolutionY) {
            _effect.resolution.width = resolutionX;
            _effect.resolution.height = resolutionY;
        }

        if (kernelSize)
            _effect.kernelSize = kernelSize;

        if (hiddenEdgeColor !== undefined)
            _effect.hiddenEdgeColor = new Color(hiddenEdgeColor);

        if (visibleEdgeColor !== undefined)
            _effect.visibleEdgeColor = new Color(visibleEdgeColor);

        if (edgeStrength !== undefined)
            _effect.edgeStrength = edgeStrength;

        if (multisampling !== undefined)
            _effect.multisampling = multisampling;

        if (patternScale !== undefined)
            _effect.patternScale = patternScale;

        if (xRay !== undefined)
            _effect.xRay = xRay;

        if (pulseSpeed !== undefined)
            _effect.pulseSpeed = pulseSpeed;

        if (blur !== undefined)
            _effect.blur = blur;

        if (patternTexture !== undefined)
            _effect.patternTexture = patternTexture;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    })
</script>
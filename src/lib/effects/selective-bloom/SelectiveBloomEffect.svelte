<script lang="ts">
    import type { SelectiveBloomEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { BlendFunction, SelectiveBloomEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";
    import { getSelectionContext } from "../../selection/context";
    import type { Object3D } from "three";

    let {
        composerId,
        lights,
        selection,
        selectionLayer,
        inverted,
        ignoreBackground,
        ...props
    }: EffectProps<SelectiveBloomEffectProps> = $props();

    const selectionContext = getSelectionContext();
    const context = getEffectComposerContext(composerId);
    const _effect = new SelectiveBloomEffect($context.scene ?? undefined, $context.camera ?? undefined, {
        blendFunction: props.blendFunction ?? BlendFunction.ADD,
        ...props
    });

    onMount(() => {
        tick().then(() => {
            _effect.inverted = !!inverted;
            _effect.ignoreBackground = !!ignoreBackground;

            $context.push(_effect);
        });

        return () => {
            _effect.dispose();
        };
    });

    $effect(() => {
        if (lights?.length === 0) {
            console.warn("SelectiveBloom requires lights to work.")
        }

        if (lights && lights.length > 0) {
            lights.forEach((light) => addLight(light, _effect))

            $context.render();

            return () => {
                lights.forEach((light) => removeLight(light, _effect))

                $context.render();
            }
        }
    });

    $effect(() => {
        if (selectionLayer !== undefined) {
            _effect.selection.layer = selectionLayer;

            $context.render();
        }
    });

    $effect(() => {

    });

    $effect(() => {
        if (!$selectionContext && selection) {
            _effect.selection.set(
                Array.isArray(selection) ? (selection as Object3D[]) : [selection as Object3D]
            );

            $context.render();

            return () => {
                _effect.selection.clear();

                $context.render();
            }
        }
    });

    $effect(() => {
        if ($selectionContext && $selectionContext.enabled) {
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
        const {
            blendFunction,
            levels,
            kernelSize,
            resolutionY,
            resolutionX,
            luminanceSmoothing,
            luminanceThreshold,
            radius,
            resolutionScale,
            intensity,
            height,
            width,
            mipmapBlur
        } = props;

        _effect.inverted = !!inverted;
        _effect.ignoreBackground = !!ignoreBackground;

        width && height && _effect.setSize(width, height);
        intensity && _effect.setIntensity(intensity);
        resolutionScale && _effect.setResolutionScale(resolutionScale);

        if (radius)
            _effect.mipmapBlurPass.radius = radius;

        if (luminanceSmoothing)
            _effect.luminanceMaterial.smoothing = luminanceSmoothing;

        if (luminanceThreshold)
            _effect.luminanceMaterial.threshold = luminanceThreshold;

        if (resolutionX)
            _effect.resolution.width = resolutionX;

        if (resolutionY)
            _effect.resolution.height = resolutionY;

        if (levels)
            _effect.mipmapBlurPass.levels = levels;

        if (kernelSize)
            _effect.kernelSize = kernelSize;

        _effect.mipmapBlurPass.enabled = !!mipmapBlur;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    });

    function addLight(light: Object3D, effect: SelectiveBloomEffect) {
        return light.layers.enable(effect.selection.layer);
    }

    function removeLight(light: Object3D, effect: SelectiveBloomEffect) {
        return light.layers.disable(effect.selection.layer);
    }
</script>
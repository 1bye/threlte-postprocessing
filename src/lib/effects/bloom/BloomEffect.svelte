<script lang="ts">
    import type { EffectProps } from "../../types";
    import { BlendFunction, BloomEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";
    import type { BloomEffectProps } from "./types";

    let {
        composerId,
        blendFunction = BlendFunction.ADD,
        mipmapBlur = true,
        ...props
    }: EffectProps<BloomEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new BloomEffect({
        blendFunction,
        mipmapBlur,
        ...props
    });

    onMount(() => {
        tick().then(() => {
            $context.push(_effect);
        });

        return () => {
            _effect.dispose();
        };
    });

    $effect(() => {
        const {
            width,
            height,
            intensity,
            resolutionScale,
            radius,
            luminanceThreshold,
            luminanceSmoothing,
            resolutionX,
            resolutionY,
            levels,
            kernelSize,
        } = props;

        width && height && _effect.setSize(width, height);
        intensity && _effect.setIntensity(intensity);
        resolutionScale && _effect.setResolutionScale(resolutionScale);

        if (radius)
            _effect.mipmapBlurPass.radius = radius;

        if (luminanceSmoothing)
            _effect.luminanceMaterial.smoothing = luminanceSmoothing;

        if (luminanceThreshold)
            _effect.luminanceMaterial.threshold = luminanceThreshold;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        if (resolutionX)
            _effect.resolution.width = resolutionX;

        if (resolutionY)
            _effect.resolution.height = resolutionY;

        if (levels)
            _effect.mipmapBlurPass.levels = levels;

        if (kernelSize)
            _effect.kernelSize = kernelSize;

        _effect.mipmapBlurPass.enabled = mipmapBlur;

        $context.render();
    });
</script>
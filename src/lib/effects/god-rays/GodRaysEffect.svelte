<script lang="ts">
    import type { GodRaysEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { GodRaysEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        sun,
        ...props
    }: EffectProps<GodRaysEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new GodRaysEffect($context.camera ?? undefined, sun, props);

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
            blendFunction,
            // TODO: Handle `clampMax`
            // clampMax,
            density,
            decay,
            exposure,
            height,
            kernelSize,
            resolutionScale,
            resolutionX,
            resolutionY,
            samples,
            weight,
            width,
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

        if (samples !== undefined)
            _effect.godRaysMaterial.samples = samples;

        if (weight !== undefined)
            _effect.godRaysMaterial.weight = weight;

        if (decay !== undefined)
            _effect.godRaysMaterial.decay = decay;

        if (exposure !== undefined)
            _effect.godRaysMaterial.exposure = exposure;

        if (density !== undefined)
            _effect.godRaysMaterial.density = density;

        if (sun)
            _effect.lightSource = sun;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        if (blur !== undefined)
            _effect.blur = blur;

        $context.render();
    })
</script>
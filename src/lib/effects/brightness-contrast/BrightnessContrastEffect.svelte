<script lang="ts">
    import type { BrightnessContrastEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { BlendFunction, BrightnessContrastEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        brightness = 0,
        contrast = 0,
        blendFunction = BlendFunction.ALPHA
    }: EffectProps<BrightnessContrastEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new BrightnessContrastEffect({
        brightness,
        contrast,
        blendFunction,
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
        if (brightness)
            _effect.brightness = brightness;

        if (contrast)
            _effect.contrast = contrast;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    })
</script>
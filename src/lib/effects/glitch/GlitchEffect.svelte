<script lang="ts">
    import type { GlitchEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { GlitchEffect, GlitchMode } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        mode,
        active = true,
        ...props
    }: EffectProps<GlitchEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new GlitchEffect(props);

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
            chromaticAberrationOffset,
            delay,
            // TODO: Handle `dtSize`
            // dtSize,
            duration,
            perturbationMap,
            ratio,
            strength,
            columns
        } = props;

        _effect.mode = active ? mode || GlitchMode.SPORADIC : GlitchMode.DISABLED;

        if (columns)
            _effect.columns = columns;

        if (strength)
            _effect.strength = strength;

        if (ratio)
            _effect.ratio = ratio;

        if (perturbationMap)
            _effect.perturbationMap = perturbationMap;

        if (duration)
            _effect.duration = duration;

        if (delay)
            _effect.delay = delay;

        if (chromaticAberrationOffset)
            _effect.chromaticAberrationOffset = chromaticAberrationOffset;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    })
</script>
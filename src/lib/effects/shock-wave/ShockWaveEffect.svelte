<script lang="ts">
    import type { ShockWaveEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { ShockWaveEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        position,
        ...props
    }: EffectProps<ShockWaveEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new ShockWaveEffect($context?.camera ?? undefined, position, props);

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
            speed,
            maxRadius,
            waveSize,
            amplitude
        } = props;

        if (maxRadius !== undefined)
            _effect.maxRadius = maxRadius;

        if (amplitude !== undefined)
            _effect.amplitude = amplitude;

        if (waveSize !== undefined)
            _effect.waveSize = waveSize;

        if (speed !== undefined)
            _effect.speed = speed;

        $context.render();
    })
</script>
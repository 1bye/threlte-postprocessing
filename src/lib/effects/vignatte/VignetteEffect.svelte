<script lang="ts">
    import type { VignetteEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { VignetteEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        ...props
    }: EffectProps<VignetteEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new VignetteEffect(props);

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
            technique,
            darkness,
            eskil,
            offset
        } = props;

        if (technique !== undefined)
            _effect.technique = technique;

        if (darkness !== undefined)
            _effect.darkness = darkness;

        if (eskil !== undefined)
            _effect.eskil = eskil;

        if (offset !== undefined)
            _effect.offset = offset;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    })
</script>
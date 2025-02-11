<script lang="ts">
    import type { ColorAverageEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { ColorAverageEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        blendFunction
    }: EffectProps<ColorAverageEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new ColorAverageEffect(blendFunction);

    onMount(() => {
        tick().then(() => {
            $context.push(_effect);
        });

        return () => {
            _effect.dispose();
        };
    });

    $effect(() => {
        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    })
</script>
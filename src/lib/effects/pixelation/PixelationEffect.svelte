<script lang="ts">
    import { PixelationEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";
    import type { EffectProps } from "../../types";

    let {
        granularity = 20,
        composerId
    }: EffectProps<{
        granularity?: number;
    }> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new PixelationEffect(granularity);

    onMount(() => {
        tick().then(() => {
            $context.push(_effect)
        });

        return () => {
            _effect.dispose();
        }
    });

    $effect(() => {
        _effect.granularity = granularity;

        $context.render();
    });
</script>
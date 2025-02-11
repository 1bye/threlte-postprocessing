<script lang="ts">
    import type { DepthEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { DepthEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        blendFunction,
        inverted
    }: EffectProps<DepthEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new DepthEffect({
        blendFunction,
        inverted
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
        if (inverted !== undefined)
            _effect.inverted = inverted;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    })
</script>
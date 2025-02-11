<script lang="ts">
    import type { ColorDepthEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { ColorDepthEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        blendFunction,
        bits
    }: EffectProps<ColorDepthEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new ColorDepthEffect({
        blendFunction,
        bits
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
        if (bits !== undefined)
            _effect.setBitDepth(bits);

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    })
</script>
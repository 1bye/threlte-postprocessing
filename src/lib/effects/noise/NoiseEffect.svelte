<script lang="ts">
    import type { NoiseEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { NoiseEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        ...props
    }: EffectProps<NoiseEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new NoiseEffect(props);

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
            premultiply
        } = props;

        if (premultiply !== undefined)
            _effect.premultiply = premultiply;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    })
</script>
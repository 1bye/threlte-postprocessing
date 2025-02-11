<script lang="ts">
    import type { FXAAEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { FXAAEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        ...props
    }: EffectProps<FXAAEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new FXAAEffect(props);

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
        } = props;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    })
</script>
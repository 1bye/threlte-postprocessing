<script lang="ts">
    import type { WaterEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { WaterEffect } from "./effect";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        ...props
    }: EffectProps<WaterEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new WaterEffect(props);

    onMount(() => {
        tick().then(() => {
            $context.push(_effect);
        });

        return () => {
            _effect.dispose();
        };
    });

    $effect(() => {
        _effect.updateState(props);

        $context.render();
    })
</script>
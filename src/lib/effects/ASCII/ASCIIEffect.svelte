<script lang="ts">
    import type { ASCIIEffectProps } from "./types";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";
    import { ASCIIEffect } from "./effect";

    let {
        composerId,
        ...props
    }: ASCIIEffectProps = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new ASCIIEffect(props);

    onMount(() => {
        tick().then(() => {
            $context.push(_effect)
        });

        return () => {
            _effect.dispose();
        }
    });

    $effect(() => {
        _effect.updateState(props);

        $context.render();
    });
</script>


<script lang="ts">
    import type { RampEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { RampEffect } from "./effect";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        ...props
    }: EffectProps<RampEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new RampEffect(props);

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
<script lang="ts">
    import type { LensFlareEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { LensFlareEffect } from "./effect";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        ...props
    }: EffectProps<LensFlareEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new LensFlareEffect(props);

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
            ..._props
        } = props;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        _effect.updateState(_props);

        $context.render();
    })
</script>
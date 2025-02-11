<script lang="ts">
    import type { SepiaEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { SepiaEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        ...props
    }: EffectProps<SepiaEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new SepiaEffect(props);

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
            intensity
        } = props;

        if (intensity !== undefined)
            _effect.intensity = intensity;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    })
</script>
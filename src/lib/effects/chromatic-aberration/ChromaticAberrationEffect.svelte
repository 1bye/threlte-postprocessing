<script lang="ts">
    import type { ChromaticAberrationEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { ChromaticAberrationEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        ...props
    }: EffectProps<ChromaticAberrationEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new ChromaticAberrationEffect(props);

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
            modulationOffset,
            radialModulation,
            offset,
            blendFunction
        } = props;

        if (offset)
            _effect.offset = offset;

        if (modulationOffset)
            _effect.modulationOffset = modulationOffset;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        _effect.radialModulation = radialModulation;

        $context.render();
    })
</script>
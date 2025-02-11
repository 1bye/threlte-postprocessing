<script lang="ts">
    import type { DotScreenEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { DotScreenEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        ...props
    }: EffectProps<DotScreenEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new DotScreenEffect(props);

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
            scale,
            angle
        } = props;

        if (angle !== undefined)
            _effect.angle = angle;

        if (scale !== undefined)
            _effect.scale = scale;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    })
</script>
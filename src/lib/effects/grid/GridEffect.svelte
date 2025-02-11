<script lang="ts">
    import type { GridEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { GridEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        size,
        ...props
    }: EffectProps<GridEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new GridEffect(props);

    onMount(() => {
        tick().then(() => {
            if (size)
                _effect.setSize(size.width, size.height);

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
            lineWidth
        } = props;

        if (lineWidth !== undefined)
            _effect.lineWidth = lineWidth;

        if (scale !== undefined)
            _effect.scale = scale;

        if (size)
            _effect.setSize(size.width, size.height);

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    })
</script>
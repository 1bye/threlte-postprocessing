<script lang="ts">
    import type { HueSaturationEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { HueSaturationEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        ...props
    }: EffectProps<HueSaturationEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new HueSaturationEffect(props);

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
            hue,
            saturation
        } = props;

        if (saturation !== undefined)
            _effect.saturation = saturation;

        if (hue !== undefined)
            _effect.hue = hue;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    })
</script>
<script lang="ts">
    import type { ScanlineEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { BlendFunction, ScanlineEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        blendFunction = BlendFunction.OVERLAY,
        density = 1.25
    }: EffectProps<ScanlineEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new ScanlineEffect({
        density,
        blendFunction
    });

    onMount(() => {
        tick().then(() => {
            $context.push(_effect);
        });

        return () => {
            _effect.dispose();
        };
    });

    $effect(() => {
        if (density !== undefined)
            _effect.density = density;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    })
</script>
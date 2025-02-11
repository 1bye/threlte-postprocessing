<script lang="ts">
    import type { LUTEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { LUT3DEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        lut,
        ...props
    }: EffectProps<LUTEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new LUT3DEffect(lut, props);

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
            tetrahedralInterpolation,
            // Can be set only on initialization
            // inputColorSpace
        } = props;

        if (lut)
            _effect.lut = lut;

        if (tetrahedralInterpolation !== undefined)
            _effect.tetrahedralInterpolation = tetrahedralInterpolation;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    })
</script>
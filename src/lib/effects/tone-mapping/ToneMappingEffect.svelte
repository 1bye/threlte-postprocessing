<script lang="ts">
    import type { ToneMappingEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { ToneMappingEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        ...props
    }: EffectProps<ToneMappingEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new ToneMappingEffect(props);

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
            adaptive,
            resolution,
            // averageLuminance,
            maxLuminance,
            minLuminance,
            mode,
            // middleGrey,
            // whitePoint,
            adaptationRate
        } = props;

        if (resolution !== undefined)
            _effect.resolution = resolution;

        // if (averageLuminance !== undefined)
        //     _effect.averageLuminance = averageLuminance;

        if (maxLuminance !== undefined)
            _effect.adaptiveLuminanceMaterial.maxLuminance = maxLuminance;

        if (minLuminance !== undefined)
            _effect.adaptiveLuminanceMaterial.minLuminance = minLuminance;

        if (mode !== undefined)
            _effect.mode = mode;

        // if (middleGrey !== undefined)
        //     _effect.middleGrey = middleGrey;

        // if (whitePoint !== undefined)
        //     _effect.whitePoint = whitePoint;

        if (adaptationRate !== undefined)
            _effect.adaptationRate = adaptationRate;

        if (adaptive !== undefined)
            _effect.adaptive = adaptive;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    })
</script>
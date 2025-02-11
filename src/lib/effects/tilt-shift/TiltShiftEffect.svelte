<script lang="ts">
    import type { TiltShiftEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { TiltShiftEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        ...props
    }: EffectProps<TiltShiftEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new TiltShiftEffect(props);

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
            offset,
            resolutionY,
            resolutionX,
            resolutionScale,
            kernelSize,
            feather,
            bias,
            rotation,
            focusArea
        } = props;

        if (resolutionScale !== undefined)
            _effect.resolution.scale = resolutionScale;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        if (resolutionX)
            _effect.resolution.width = resolutionX;

        if (resolutionY)
            _effect.resolution.height = resolutionY;

        if (focusArea)
            _effect.focusArea = focusArea;

        if (rotation)
            _effect.rotation = rotation;

        if (bias)
            _effect.bias = bias;

        if (feather)
            _effect.feather = feather;

        if (offset)
            _effect.offset = offset;

        if (kernelSize)
            _effect.blurPass.kernelSize = kernelSize;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    })
</script>
<script lang="ts">
    import type { DepthOfFieldEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { DepthOfFieldEffect, MaskFunction } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";
    import { useThrelte } from "@threlte/core";
    import { type DepthPackingStrategies, Vector3 } from "three";

    let {
        composerId,
        ...props
    }: EffectProps<DepthOfFieldEffectProps> = $props();

    const { camera } = useThrelte();
    const context = getEffectComposerContext(composerId);
    const _effect = new DepthOfFieldEffect($context.camera ?? camera.current, props);

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
            depthTexture,
            blendFunction,
            worldFocusDistance,
            worldFocusRange,
            focusDistance,
            focusRange,
            focalLength,
            bokehScale,
            resolutionScale,
            resolutionX,
            resolutionY,
            width,
            height,
            target
        } = props;

        width && height && _effect.setSize(width, height);

        if ($context.camera)
            _effect.mainCamera = $context.camera;

        if (worldFocusDistance !== undefined)
            _effect.cocMaterial.worldFocusDistance = worldFocusDistance;

        if (worldFocusRange !== undefined)
            _effect.cocMaterial.worldFocusRange = worldFocusRange;

        if (focusDistance !== undefined)
            _effect.cocMaterial.focusDistance = focusDistance;

        if (focusRange !== undefined)
            _effect.cocMaterial.focusRange = focusRange;

        if (focalLength !== undefined)
            _effect.cocMaterial.focalLength = focalLength;

        if (resolutionScale !== undefined)
            _effect.resolution.scale = resolutionScale;

        if (bokehScale !== undefined)
            _effect.bokehScale = bokehScale;

        if (resolutionX && resolutionY) {
            _effect.resolution.width = resolutionX;
            _effect.resolution.height = resolutionY;
        }

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        if (target != null || target != undefined)
            _effect.target = new Vector3()

        // Depth texture for depth picking with optional packing strategy
        if (depthTexture) _effect.setDepthTexture(depthTexture.texture, depthTexture.packing as DepthPackingStrategies)

        // Temporary fix that restores DOF 6.21.3 behavior, everything since then lets shapes leak through the blur
        const maskPass = (_effect as any).maskPass
        maskPass.maskFunction = MaskFunction.MULTIPLY_RGB_SET_ALPHA;

        $context.render();
    })
</script>
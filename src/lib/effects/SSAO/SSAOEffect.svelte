<script lang="ts">
    import type { SSAOEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { BlendFunction, SSAOEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        ...props
    }: EffectProps<SSAOEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new SSAOEffect($context.camera ?? undefined, $context.normalPass && !$context.downSamplingPass ? ($context.normalPass as any).texture : null, {
        blendFunction: BlendFunction.MULTIPLY,
        samples: 30,
        rings: 4,
        distanceThreshold: 1.0,
        distanceFalloff: 0.0,
        rangeThreshold: 0.5,
        rangeFalloff: 0.1,
        luminanceInfluence: 0.9,
        radius: 20,
        bias: 0.5,
        intensity: 1.0,
        color: undefined,
        // @ts-ignore
        normalDepthBuffer: downSamplingPass ? downSamplingPass.texture : null,
        resolutionScale: $context.resolutionScale ?? 1,
        depthAwareUpsampling: true,
        ...props,
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
        const {
            resolutionScale,
            blendFunction,
            resolutionX,
            width,
            samples,
            resolutionY,
            height,
            depthAwareUpsampling,
            distanceFalloff,
            distanceScaling,
            distanceThreshold,
            fade,
            color,
            luminanceInfluence,
            minRadiusScale,
            intensity,
            normalDepthBuffer,
            radius,
            // rangeThreshold,
            // rangeFalloff,
            rings,
            worldDistanceFalloff,
            worldDistanceThreshold,
            worldProximityThreshold,
            worldProximityFalloff,
            bias
        } = props;

        width && height && _effect.setSize(width, height);

        if (resolutionScale !== undefined)
            _effect.resolution.scale = resolutionScale;

        if (resolutionX && resolutionY) {
            _effect.resolution.width = resolutionX;
            _effect.resolution.height = resolutionY;
        }

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        if (samples !== undefined)
            _effect.samples = samples;

        if (depthAwareUpsampling !== undefined)
            _effect.depthAwareUpsampling = depthAwareUpsampling;

        if (distanceFalloff !== undefined)
            _effect.ssaoMaterial.distanceFalloff = distanceFalloff;

        if (distanceScaling !== undefined)
            _effect.ssaoMaterial.distanceScaling = distanceScaling;

        if (distanceThreshold !== undefined)
            _effect.ssaoMaterial.distanceThreshold = distanceThreshold;

        if (fade !== undefined)
            _effect.ssaoMaterial.fade = fade;

        if (luminanceInfluence !== undefined)
            _effect.luminanceInfluence = !!luminanceInfluence;

        if (minRadiusScale !== undefined)
            _effect.ssaoMaterial.minRadiusScale = minRadiusScale;

        if (intensity !== undefined)
            _effect.ssaoMaterial.intensity = intensity;

        if (normalDepthBuffer !== undefined)
            _effect.ssaoMaterial.normalDepthBuffer = normalDepthBuffer;

        if (radius !== undefined)
            _effect.radius = radius;

        if (rings !== undefined)
            _effect.rings = rings;

        if (color !== undefined)
            _effect.color = color;

        if (worldDistanceFalloff !== undefined)
            _effect.ssaoMaterial.worldDistanceFalloff = worldDistanceFalloff;

        if (worldDistanceThreshold !== undefined)
            _effect.ssaoMaterial.worldDistanceThreshold = worldDistanceThreshold;

        if (worldProximityThreshold !== undefined)
            _effect.ssaoMaterial.worldProximityThreshold = worldProximityThreshold;

        if (worldProximityFalloff !== undefined)
            _effect.ssaoMaterial.worldProximityFalloff = worldProximityFalloff;

        if (bias !== undefined)
            _effect.ssaoMaterial.bias = bias;

        $context.render();
    })
</script>
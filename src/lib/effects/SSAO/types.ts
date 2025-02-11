import type { BlendFunction } from "postprocessing";
import type { Color, Texture } from "three";

export type SSAOEffectProps = {
    blendFunction?: BlendFunction;
    distanceScaling?: boolean;
    depthAwareUpsampling?: boolean;
    normalDepthBuffer?: Texture;
    samples?: number;
    rings?: number;
    worldDistanceThreshold?: number;
    worldDistanceFalloff?: number;
    worldProximityThreshold?: number;
    worldProximityFalloff?: number;
    distanceThreshold?: number;
    distanceFalloff?: number;
    rangeThreshold?: number;
    rangeFalloff?: number;
    minRadiusScale?: number;
    luminanceInfluence?: number;
    radius?: number;
    intensity?: number;
    bias?: number;
    fade?: number;
    color?: Color;
    resolutionScale?: number;
    resolutionX?: number;
    resolutionY?: number;
    width?: number;
    height?: number;
}
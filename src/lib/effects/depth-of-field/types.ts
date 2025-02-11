import type { BlendFunction } from "postprocessing";
import type { Texture, Vector3 } from "three";

export type DepthOfFieldEffectProps = {
    blendFunction?: BlendFunction;
    worldFocusDistance?: number;
    worldFocusRange?: number;
    focusDistance?: number;
    focalLength?: number;
    focusRange?: number;
    bokehScale?: number;
    resolutionScale?: number;
    resolutionX?: number;
    resolutionY?: number;
    width?: number;
    height?: number;
} & {
    target?: Vector3;
    depthTexture?: {
        texture: Texture;
        packing: number;
    }
}
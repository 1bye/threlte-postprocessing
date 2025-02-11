import type { BlendFunction } from "postprocessing";

export type GridEffectProps = {
    blendFunction?: BlendFunction;
    scale?: number;
    lineWidth?: number;
    size?: {
        width: number
        height: number
    }
}
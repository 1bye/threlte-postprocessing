import type { BlendFunction } from "postprocessing";

export type HueSaturationEffectProps = {
    blendFunction?: BlendFunction;
    hue?: number;
    saturation?: number;
}
import type { BlendFunction } from "postprocessing";

export type BrightnessContrastEffectProps = {
    blendFunction?: BlendFunction;
    brightness?: number;
    contrast?: number;
}
import type { BlendFunction, VignetteTechnique } from "postprocessing";

export type VignetteEffectProps = {
    blendFunction?: BlendFunction;
    technique?: VignetteTechnique;
    eskil?: boolean;
    offset?: number;
    darkness?: number;
}
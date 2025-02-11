import { type BlendFunction, ToneMappingMode } from "postprocessing";

export type ToneMappingEffectProps = {
    blendFunction?: BlendFunction;
    adaptive?: boolean;
    mode?: ToneMappingMode;
    resolution?: number;
    maxLuminance?: number;
    whitePoint?: number;
    middleGrey?: number;
    minLuminance?: number;
    averageLuminance?: number;
    adaptationRate?: number;
}
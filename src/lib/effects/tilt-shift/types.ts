import type { BlendFunction, KernelSize } from "postprocessing";

export type TiltShiftEffectProps = {
    blendFunction?: BlendFunction;
    offset?: number;
    rotation?: number;
    focusArea?: number;
    feather?: number;
    bias?: number;
    kernelSize?: KernelSize;
    resolutionScale?: number;
    resolutionX?: number;
    resolutionY?: number;
}
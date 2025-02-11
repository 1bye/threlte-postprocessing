import { type BlendFunction, KernelSize } from "postprocessing";
import { type Mesh, Points } from "three";

export type GodRaysEffectProps = {
    blendFunction?: BlendFunction;
    samples?: number;
    density?: number;
    decay?: number;
    weight?: number;
    exposure?: number;
    clampMax?: number;
    resolutionScale?: number;
    resolutionX?: number;
    resolutionY?: number;
    width?: number;
    height?: number;
    kernelSize?: KernelSize;
    blur?: boolean;
} & {
    sun: Mesh | Points;
}
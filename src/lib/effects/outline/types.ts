import type { BlendFunction, KernelSize } from "postprocessing";
import type { Camera, Scene, Texture } from "three";

export type OutlineEffectProps = {
    scene?: Scene,
    camera?: Camera,

    blendFunction?: BlendFunction;
    patternTexture?: Texture;
    patternScale?: number;
    selectionLayer?: number;
    edgeStrength?: number;
    pulseSpeed?: number;
    visibleEdgeColor?: number;
    hiddenEdgeColor?: number;
    multisampling?: number;
    resolutionScale?: number;
    resolutionX?: number;
    resolutionY?: number;
    width?: number;
    height?: number;
    kernelSize?: KernelSize;
    blur?: boolean;
    xRay?: boolean;
}
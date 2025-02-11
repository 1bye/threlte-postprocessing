import type { BlendFunction } from "postprocessing";
import type { ColorSpace, Texture } from "three";

export type LUTEffectProps = {
    lut: Texture;

    blendFunction?: BlendFunction;
    tetrahedralInterpolation?: boolean;
    inputColorSpace?: ColorSpace;
}
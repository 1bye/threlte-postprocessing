import type { BlendFunction } from "postprocessing";
import type { Texture } from "three";

export type TextureEffectProps = {
    blendFunction?: BlendFunction;
    texture?: Texture;
    aspectCorrection?: boolean;

    textureSrc: string;
    /** opacity of provided texture */
    opacity?: number
}
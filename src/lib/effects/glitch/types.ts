import type { BlendFunction, GlitchMode } from "postprocessing";
import { Texture, Vector2 } from "three";

export type GlitchEffectProps = {
    blendFunction?: BlendFunction;
    chromaticAberrationOffset?: Vector2;
    delay?: Vector2;
    duration?: Vector2;
    strength?: Vector2;
    perturbationMap?: Texture;
    dtSize?: number;
    columns?: number;
    ratio?: number;
} & {
    mode?: GlitchMode;
    active?: boolean;
}
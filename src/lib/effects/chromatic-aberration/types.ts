import type { Vector2 } from "three";
import type { BlendFunction } from "postprocessing";

export type ChromaticAberrationEffectProps = {
    blendFunction?: BlendFunction;
    offset?: Vector2;
    radialModulation: boolean;
    modulationOffset: number;
}
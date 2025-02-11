import { type Effect, EffectAttribute } from "postprocessing";

export const isConvolution = (effect: Effect): boolean =>
    (effect.getAttributes() & EffectAttribute.CONVOLUTION) === EffectAttribute.CONVOLUTION;
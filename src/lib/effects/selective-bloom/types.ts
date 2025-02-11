import type { BloomEffectOptions } from "postprocessing";
import type { Object3D } from "three";

export type SelectiveBloomEffectProps = BloomEffectOptions &
    Partial<{
        lights: Object3D[]
        selection: Object3D | Object3D[]
        selectionLayer: number
        inverted: boolean
        ignoreBackground: boolean
    }>
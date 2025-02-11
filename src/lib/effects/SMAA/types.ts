import type { EdgeDetectionMode, PredicationMode, SMAAPreset } from "postprocessing";

export type SMAAEffectProps = {
    preset?: SMAAPreset;
    edgeDetectionMode?: EdgeDetectionMode;
    predicationMode?: PredicationMode;
}
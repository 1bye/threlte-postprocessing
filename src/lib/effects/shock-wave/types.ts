import type { Vector3 } from "three";

export type ShockWaveEffectProps = {
    position?: Vector3;

    speed?: number;
    maxRadius?: number;
    waveSize?: number;
    amplitude?: number;
}
import type { EffectProps } from "../..";

export interface IASCIIEffectProps {
    font?: string
    characters?: string
    fontSize?: number
    cellSize?: number
    color?: string
    invert?: boolean
}

export type ASCIIEffectProps = EffectProps<IASCIIEffectProps>;
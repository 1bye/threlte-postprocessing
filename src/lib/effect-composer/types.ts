import type { Snippet } from "svelte";
import type { Camera, Scene, TextureDataType } from "three";
import type { DepthDownsamplingPass, NormalPass, EffectComposer, Effect, Pass } from "postprocessing";

export type EffectComposerProps = {
    id?: string;

    enabled?: boolean;
    children: Snippet;
    depthBuffer?: boolean;
    /** Only used for SSGI currently, leave it disabled for everything else unless it's needed */
    enableNormalPass?: boolean;
    stencilBuffer?: boolean;
    autoClear?: boolean;
    resolutionScale?: number;
    multisampling?: number;
    frameBufferType?: TextureDataType;
    renderPriority?: number;
    camera?: Camera;
    scene?: Scene;
}

export type EffectComposerContext = {
    composer: EffectComposer | null;
    normalPass: NormalPass | null;
    downSamplingPass: DepthDownsamplingPass | null;
    camera: Camera | null;
    scene: Scene | null;
    resolutionScale?: number;

    push(item: Effect | Pass): number;
    remove(item: Effect | Pass): void;

    removeByIndex(index: number): void;
    disposeByIndex(index: number): void;

    render(): void;
};
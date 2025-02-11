import * as THREE from "three";
import { useFBO } from "@threlte/extras";

type FBO = {
    read: THREE.WebGLRenderTarget
    write: THREE.WebGLRenderTarget
    swap: () => void
    dispose: () => void
}

type Options = {
    minFilter?: THREE.TextureFilter
    format?: THREE.PixelFormat
    type?: THREE.TextureDataType
    depth: boolean
}

export function useDoubleFBO(width: number, height: number, options: Options): FBO {
    const read = useFBO({
        size: {
            width,
            height,
        },
        ...options
    });

    const write = useFBO({
        size: {
            width,
            height,
        },
        ...options
    });

    const fbo = $state({
        read,
        write,
        swap: () => {
            const temp = fbo.read;
            fbo.read = fbo.write;
            fbo.write = temp;
        },
        dispose: () => {
            read.dispose();
            write.dispose();
        },
    });

    return fbo;
};
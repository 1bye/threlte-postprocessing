import { ShaderMaterial, Texture, Vector2, Vector3 } from "three";
import { OPTS } from "../constant";
import { useThrelte } from "@threlte/core";

import baseVertex from "../glsl/base.vert?raw";
import clearFrag from "../glsl/clear.frag?raw";
import curlFrag from "../glsl/curl.frag?raw";
import divergenceFrag from "../glsl/divergence.frag?raw";
import gradientSubstractFrag from "../glsl/gradientSubstract.frag?raw";
import pressureFrag from "../glsl/pressure.frag?raw";
import splatFrag from "../glsl/splat.frag?raw";
import advectionFrag from "../glsl/advection.frag?raw";
import vorticityFrag from "../glsl/vorticity.frag?raw";

export function useMaterials(): { [key: string]: ShaderMaterial } {
    // TODO: Maybe subscribe to size
    const size = useThrelte().size;

    const advection = new ShaderMaterial({
        uniforms: {
            uVelocity: {
                value: new Texture(),
            },
            uSource: {
                value: new Texture(),
            },
            dt: {
                value: 0.016,
            },
            uDissipation: {
                value: 1.0,
            },
            texelSize: { value: new Vector2() },
        },
        fragmentShader: advectionFrag,
    });

    const clear = new ShaderMaterial({
        uniforms: {
            uTexture: {
                value: new Texture(),
            },
            uClearValue: {
                value: OPTS.pressure,
            },
            texelSize: {
                value: new Vector2(),
            },
        },
        fragmentShader: clearFrag,
    });

    const curl = new ShaderMaterial({
        uniforms: {
            uVelocity: {
                value: new Texture(),
            },
            texelSize: {
                value: new Vector2(),
            },
        },
        fragmentShader: curlFrag,
    });

    const divergence = new ShaderMaterial({
        uniforms: {
            uVelocity: {
                value: new Texture(),
            },
            texelSize: {
                value: new Vector2(),
            },
        },
        fragmentShader: divergenceFrag,
    });

    const gradientSubstract = new ShaderMaterial({
        uniforms: {
            uPressure: {
                value: new Texture(),
            },
            uVelocity: {
                value: new Texture(),
            },
            texelSize: {
                value: new Vector2(),
            },
        },
        fragmentShader: gradientSubstractFrag,
    });

    const pressure = new ShaderMaterial({
        uniforms: {
            uPressure: {
                value: new Texture(),
            },
            uDivergence: {
                value: new Texture(),
            },
            texelSize: {
                value: new Vector2(),
            },
        },
        fragmentShader: pressureFrag,
    });

    const splat = new ShaderMaterial({
        uniforms: {
            uTarget: {
                value: new Texture(),
            },
            aspectRatio: {
                value: size.current.width / size.current.height,
            },
            uColor: {
                value: new Vector3(),
            },
            uPointer: {
                value: new Vector2(),
            },
            uRadius: {
                value: OPTS.radius / 100.0,
            },
            texelSize: {
                value: new Vector2(),
            },
        },
        fragmentShader: splatFrag,
    });

    const vorticity = new ShaderMaterial({
        uniforms: {
            uVelocity: {
                value: new Texture(),
            },
            uCurl: {
                value: new Texture(),
            },
            uCurlValue: {
                value: OPTS.curl,
            },
            dt: {
                value: 0.016,
            },
            texelSize: {
                value: new Vector2(),
            },
        },
        fragmentShader: vorticityFrag,
    });

    const shaderMaterials = $state({
        splat,
        curl,
        clear,
        divergence,
        pressure,
        gradientSubstract,
        advection,
        vorticity,
    });

    $effect(() => {
        for (const material of Object.values(shaderMaterials)) {
            const aspectRatio = size.current.width / (size.current.height + 400);

            material.uniforms.texelSize.value.set(1 / (OPTS.simRes * aspectRatio), 1 / OPTS.simRes);
            material.vertexShader = baseVertex;
            material.depthTest = false;
            material.depthWrite = false;
        }

        // return () => {
        //     for (const material of Object.values(shaderMaterials)) {
        //         material.dispose();
        //     }
        // };
    });

    return shaderMaterials;
};
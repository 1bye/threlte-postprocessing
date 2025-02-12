import type { EffectProps } from "../types";
import { Effect } from "postprocessing";
import { Texture, Uniform, Vector3 } from "three";
import { hexToRgb } from "../utils";

// import fragmentShader from "../glsl/post.frag?raw";

const fragmentShader = `uniform sampler2D tFluid;

uniform vec3 uColor;
uniform vec3 uBackgroundColor;

uniform float uDistort;
uniform float uIntensity;
uniform float uRainbow;
uniform float uBlend;
uniform float uShowBackground;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

    vec3 fluidColor = texture2D(tFluid, uv).rgb;

    vec2 distortedUv = uv - fluidColor.rg * uDistort;

    vec4 texture = texture2D(inputBuffer, distortedUv);

    float intensity = length(fluidColor) * uIntensity;

    vec3 selectedColor = uColor * length(fluidColor);

    vec4 colorForFluidEffect = vec4(uRainbow == 1.0 ? fluidColor : selectedColor, 1.0);

    vec4 computedBgColor = vec4(uBackgroundColor, 1.);

    if(uShowBackground == 0.0) {
        outputColor = mix(texture, colorForFluidEffect, intensity);
        return;
    }

    vec4 computedFluidColor = mix(texture, colorForFluidEffect, uBlend);

    vec4 finalColor;

    if(texture.a < 0.1) {
        finalColor = mix(computedBgColor, colorForFluidEffect, intensity);
    } else {
        finalColor = mix(computedFluidColor, computedBgColor, 1.0 - texture.a);
    }

    outputColor = finalColor;
}`;

type Uniforms = {
    tFluid: Texture | null;
    uColor: Vector3;
    uBackgroundColor: Vector3;
    uRainbow: boolean;
    uShowBackground: boolean;
    uDistort: number;
    uBlend: number;
    uIntensity: number;
};

export class FluidEffect extends Effect {
    state: Partial<EffectProps>;

    constructor(props: EffectProps = {}) {
        const uniforms: Record<keyof Uniforms, Uniform> = {
            tFluid: new Uniform(props.tFluid),
            uDistort: new Uniform(props.distortion),
            uRainbow: new Uniform(props.rainbow),
            uIntensity: new Uniform(props.intensity),
            uBlend: new Uniform(props.blend),
            uShowBackground: new Uniform(props.showBackground),

            uColor: new Uniform(hexToRgb(props.fluidColor!)),
            uBackgroundColor: new Uniform(hexToRgb(props.backgroundColor!)),
        };

        super("FluidEffect", fragmentShader, {
            blendFunction: props.blendFunction,
            uniforms: new Map(Object.entries(uniforms)),
        });

        this.state = {
            ...props,
        };
    }

    private updateUniform<K extends keyof Uniforms>(key: K, value: Uniforms[K]) {
        const uniform = this.uniforms.get(key);
        if (uniform) {
            uniform.value = value;
        }
    }

    update() {
        this.updateUniform("uIntensity", this.state.intensity!);
        this.updateUniform("uDistort", this.state.distortion!);
        this.updateUniform("uRainbow", this.state.rainbow!);
        this.updateUniform("uBlend", this.state.blend!);
        this.updateUniform("uShowBackground", this.state.showBackground!);
        this.updateUniform("uColor", hexToRgb(this.state.fluidColor!));
        this.updateUniform("uBackgroundColor", hexToRgb(this.state.backgroundColor!));
    }
}
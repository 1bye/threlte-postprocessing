import { BlendFunction, Effect, EffectAttribute } from "postprocessing";
import { Uniform } from "three";

export type WaterEffectOptions = {
    blendFunction?: BlendFunction;
    factor?: number;
};

const WaterShader = {
    fragmentShader: /* glsl */ `
    uniform float factor;

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
      vec2 vUv = uv;
      float frequency = 6.0 * factor;
      float amplitude = 0.015 * factor;
      float x = vUv.y * frequency + time * 0.7; 
      float y = vUv.x * frequency + time * 0.3;
      vUv.x += cos(x + y) * amplitude * cos(y);
      vUv.y += sin(x - y) * amplitude * cos(y);
      vec4 rgba = texture(inputBuffer, vUv);
      outputColor = rgba;
    }
  `,
}

type Uniforms = {
    factor: number;
}

export class WaterEffect extends Effect {
    state: Required<WaterEffectOptions>;

    constructor({ blendFunction = BlendFunction.NORMAL, factor = 0 } = {}) {
        super("WaterEffect", WaterShader.fragmentShader, {
            blendFunction,
            attributes: EffectAttribute.CONVOLUTION,
            uniforms: new Map<string, Uniform<number | number[]>>([
                ["factor", new Uniform(factor)]
            ]),
        });

        this.state = {
            blendFunction,
            factor
        }
    }

    private updateUniform<K extends keyof Uniforms>(key: K, value: Uniforms[K]) {
        const uniform = this.uniforms.get(key);
        if (uniform) {
            uniform.value = value;
        }
    }

    updateUniforms() {
        this.updateUniform("factor", this.state.factor);
    }

    updateState(state: WaterEffectOptions) {
        this.state = {
            ...this.state,
            ...state
        };

        if (state.blendFunction)
            this.blendMode.blendFunction = state.blendFunction;

        this.updateUniforms();
    }
}
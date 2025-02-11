import { Effect } from "postprocessing";
import { Color, Texture, Uniform } from "three";

const RampShader = {
    fragmentShader: /* glsl */ `
    uniform int rampType;

    uniform vec2 rampStart;
    uniform vec2 rampEnd;

    uniform vec4 startColor;
    uniform vec4 endColor;

    uniform float rampBias;
    uniform float rampGain;

    uniform bool rampMask;
    uniform bool rampInvert;

    float getBias(float time, float bias) {
      return time / (((1.0 / bias) - 2.0) * (1.0 - time) + 1.0);
    }

    float getGain(float time, float gain) {
      if (time < 0.5)
        return getBias(time * 2.0, gain) / 2.0;
      else
        return getBias(time * 2.0 - 1.0, 1.0 - gain) / 2.0 + 0.5;
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
      vec2 centerPixel = uv * resolution;
      vec2 startPixel = rampStart * resolution;
      vec2 endPixel = rampEnd * resolution;

      float rampAlpha;

      if (rampType == 1) {
        vec2 fuv = centerPixel / resolution.y;
        vec2 suv = startPixel / resolution.y;
        vec2 euv = endPixel / resolution.y;

        float radius = length(suv - euv);
        float falloff = length(fuv - suv);
        rampAlpha = smoothstep(0.0, radius, falloff);
      } else {
        float radius = length(startPixel - endPixel);
        vec2 direction = normalize(vec2(endPixel.x - startPixel.x, -(startPixel.y - endPixel.y)));

        float fade = dot(centerPixel - startPixel, direction);
        if (rampType == 2) fade = abs(fade);

        rampAlpha = smoothstep(0.0, 1.0, fade / radius);
      }

      rampAlpha = abs((rampInvert ? 1.0 : 0.0) - getBias(rampAlpha, rampBias) * getGain(rampAlpha, rampGain));

      if (rampMask) {
        vec4 inputBuff = texture2D(inputBuffer, uv);
        outputColor = mix(inputBuff, inputColor, rampAlpha);
      } else {
        outputColor = mix(startColor, endColor, rampAlpha);
      }
    }
  `,
};

export enum RampType {
    Linear,
    Radial,
    MirroredLinear,
}

export type RampEffectOptions = {
    /**
     * Type of ramp gradient.
     */
    rampType: RampType;
    /**
     * Starting point of the ramp gradient in normalized coordinates.
     *
     * Ranges from `[0 - 1]` as `[x, y]`. Default is `[0.5, 0.5]`.
     */
    rampStart: [number, number];
    /**
     * Ending point of the ramp gradient in normalized coordinates.
     *
     * Ranges from `[0 - 1]` as `[x, y]`. Default is `[1, 1]`
     */
    rampEnd: [number, number];
    /**
     * Color at the starting point of the gradient.
     *
     * Default is black: `[0, 0, 0, 1]`
     */
    startColor: [number, number, number, number];
    /**
     * Color at the ending point of the gradient.
     *
     * Default is white: `[1, 1, 1, 1]`
     */
    endColor: [number, number, number, number];
    /**
     * Bias for the interpolation curve when both bias and gain are 0.5.
     *
     * Ranges from `[0 - 1]`. Default is `0.5`.
     */
    rampBias: number;
    /**
     * Gain for the interpolation curve when both bias and gain are 0.5.
     *
     * Ranges from `[0 - 1]`. Default is `0.5`.
     */
    rampGain: number;
    /**
     * When enabled, the ramp gradient is used as an effect mask, and colors are ignored.
     *
     * Default is `false`.
     */
    rampMask: boolean;
    /**
     * Controls whether the ramp gradient is inverted.
     *
     * When disabled, rampStart is transparent and rampEnd is opaque.
     *
     * Default is `false`.
     */
    rampInvert: boolean;
}

type Uniforms = {
    rampType: RampType;
    rampStart: [number, number];
    rampEnd: [number, number];
    startColor: [number, number, number, number];
    endColor: [number, number, number, number];
    rampBias: number;
    rampGain: number;
    rampMask: boolean;
    rampInvert: boolean;
};

export class RampEffect extends Effect {
    state: RampEffectOptions;

    constructor({
                    /**
                     * Type of ramp gradient.
                     */
                    rampType = RampType.Linear,
                    /**
                     * Starting point of the ramp gradient in normalized coordinates.
                     *
                     * Ranges from `[0 - 1]` as `[x, y]`. Default is `[0.5, 0.5]`.
                     */
                    rampStart = [0.5, 0.5],
                    /**
                     * Ending point of the ramp gradient in normalized coordinates.
                     *
                     * Ranges from `[0 - 1]` as `[x, y]`. Default is `[1, 1]`
                     */
                    rampEnd = [1, 1],
                    /**
                     * Color at the starting point of the gradient.
                     *
                     * Default is black: `[0, 0, 0, 1]`
                     */
                    startColor = [0, 0, 0, 1],
                    /**
                     * Color at the ending point of the gradient.
                     *
                     * Default is white: `[1, 1, 1, 1]`
                     */
                    endColor = [1, 1, 1, 1],
                    /**
                     * Bias for the interpolation curve when both bias and gain are 0.5.
                     *
                     * Ranges from `[0 - 1]`. Default is `0.5`.
                     */
                    rampBias = 0.5,
                    /**
                     * Gain for the interpolation curve when both bias and gain are 0.5.
                     *
                     * Ranges from `[0 - 1]`. Default is `0.5`.
                     */
                    rampGain = 0.5,
                    /**
                     * When enabled, the ramp gradient is used as an effect mask, and colors are ignored.
                     *
                     * Default is `false`.
                     */
                    rampMask = false,
                    /**
                     * Controls whether the ramp gradient is inverted.
                     *
                     * When disabled, rampStart is transparent and rampEnd is opaque.
                     *
                     * Default is `false`.
                     */
                    rampInvert = false,
                }: Partial<RampEffectOptions> = {}) {
        super("RampEffect", RampShader.fragmentShader, {
            uniforms: new Map<string, Uniform>([
                ["rampType", new Uniform(rampType)],
                ["rampStart", new Uniform(rampStart)],
                ["rampEnd", new Uniform(rampEnd)],
                ["startColor", new Uniform(startColor)],
                ["endColor", new Uniform(endColor)],
                ["rampBias", new Uniform(rampBias)],
                ["rampGain", new Uniform(rampGain)],
                ["rampMask", new Uniform(rampMask)],
                ["rampInvert", new Uniform(rampInvert)],
            ]),
        });

        this.state = {
            rampBias,
            rampEnd,
            rampType,
            endColor,
            rampGain,
            rampInvert,
            rampMask,
            rampStart,
            startColor
        }
    }

    private updateUniform<K extends keyof Uniforms>(key: K, value: Uniforms[K]) {
        const uniform = this.uniforms.get(key);
        if (uniform) {
            uniform.value = value;
        }
    }

    updateUniforms() {
        const {
            rampBias,
            rampEnd,
            rampType,
            endColor,
            rampGain,
            rampInvert,
            rampMask,
            rampStart,
            startColor
        } = this.state;

        this.updateUniform("rampEnd", rampEnd);
        this.updateUniform("rampBias", rampBias);
        this.updateUniform("rampType", rampType);
        this.updateUniform("endColor", endColor);
        this.updateUniform("rampGain", rampGain);
        this.updateUniform("rampInvert", rampInvert);
        this.updateUniform("rampMask", rampMask);
        this.updateUniform("rampStart", rampStart);
        this.updateUniform("startColor", startColor);
    }

    updateState(state: Partial<RampEffectOptions>) {
        this.state = {
            ...this.state,
            ...state
        }
    }
}

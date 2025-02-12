import type { IASCIIEffectProps } from "./types";
import { Effect } from "postprocessing";
import { CanvasTexture, Color, NearestFilter, RepeatWrapping, Texture, Uniform } from "three";

const fragment = `
uniform sampler2D uCharacters;
uniform float uCharactersCount;
uniform float uCellSize;
uniform bool uInvert;
uniform vec3 uColor;

const vec2 SIZE = vec2(16.);

vec3 greyscale(vec3 color, float strength) {
    float g = dot(color, vec3(0.299, 0.587, 0.114));
    return mix(color, vec3(g), strength);
}

vec3 greyscale(vec3 color) {
    return greyscale(color, 1.0);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 cell = resolution / uCellSize;
    vec2 grid = 1.0 / cell;
    vec2 pixelizedUV = grid * (0.5 + floor(uv / grid));
    vec4 pixelized = texture2D(inputBuffer, pixelizedUV);
    float greyscaled = greyscale(pixelized.rgb).r;

    if (uInvert) {
        greyscaled = 1.0 - greyscaled;
    }

    float characterIndex = floor((uCharactersCount - 1.0) * greyscaled);
    vec2 characterPosition = vec2(mod(characterIndex, SIZE.x), floor(characterIndex / SIZE.y));
    vec2 offset = vec2(characterPosition.x, -characterPosition.y) / SIZE;
    vec2 charUV = mod(uv * (cell / SIZE), 1.0 / SIZE) - vec2(0., 1.0 / SIZE) + offset;
    vec4 asciiCharacter = texture2D(uCharacters, charUV);

    asciiCharacter.rgb = uColor * asciiCharacter.r;
    asciiCharacter.a = pixelized.a;
    outputColor = asciiCharacter;
}
`;


type Uniforms = {
    uCharacters: Texture;
    uCellSize: number;
    uCharactersCount: number;
    uInvert: boolean;
    uColor: Color;
};

export class ASCIIEffect extends Effect {
    state: Required<IASCIIEffectProps>;

    constructor({
                    font = "arial",
                    characters = ` .:,'-^=*+?!|0#X%WM@`,
                    fontSize = 54,
                    cellSize = 16,
                    color = "#ffffff",
                    invert = false,
                }: IASCIIEffectProps = {}) {
        const uniforms = new Map<string, Uniform>([
            ["uCharacters", new Uniform(new Texture())],
            ["uCellSize", new Uniform(cellSize)],
            ["uCharactersCount", new Uniform(characters.length)],
            ["uColor", new Uniform(new Color(color))],
            ["uInvert", new Uniform(invert)],
        ]);

        super("ASCIIEffect", fragment, { uniforms });

        const charactersTextureUniform = this.uniforms.get("uCharacters");

        this.state = {
            font,
            characters,
            fontSize,
            cellSize,
            color,
            invert,
        }

        if (charactersTextureUniform) {
            charactersTextureUniform.value = this.createCharactersTexture(characters, font, fontSize);
        }
    }

    private updateUniform<K extends keyof Uniforms>(key: K, value: Uniforms[K]) {
        const uniform = this.uniforms.get(key);
        if (uniform) {
            uniform.value = value;
        }
    }

    updateUniforms() {
        this.updateUniform("uCharacters", this.createCharactersTexture(this.state.characters, this.state.font, this.state.fontSize));
        this.updateUniform("uInvert", this.state.invert!);
        this.updateUniform("uColor", new Color(this.state.color));
        this.updateUniform("uCellSize", this.state.cellSize!);
        this.updateUniform("uCharactersCount", this.state.characters?.length!);
    }

    updateState(state: Partial<IASCIIEffectProps>) {
        this.state = {
            ...this.state,
            ...state
        };

        this.updateUniforms();
    }

    /** Draws the characters on a Canvas and returns a texture */
    public createCharactersTexture(characters: string, font: string, fontSize: number): Texture {
        const canvas = document.createElement("canvas");
        const SIZE = 1024;
        const MAX_PER_ROW = 16;
        const CELL = SIZE / MAX_PER_ROW;

        canvas.width = canvas.height = SIZE;
        const texture = new CanvasTexture(canvas, undefined, RepeatWrapping, RepeatWrapping, NearestFilter, NearestFilter);
        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Context not available");
        }

        context.clearRect(0, 0, SIZE, SIZE);
        context.font = `${fontSize}px ${font}`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#fff";

        for (let i = 0; i < characters.length; i++) {
            const char = characters[i];
            const x = i % MAX_PER_ROW;
            const y = Math.floor(i / MAX_PER_ROW);
            context.fillText(char, x * CELL + CELL / 2, y * CELL + CELL / 2);
        }

        texture.needsUpdate = true;
        return texture;
    }
}
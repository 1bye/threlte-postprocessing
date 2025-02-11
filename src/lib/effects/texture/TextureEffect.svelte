<script lang="ts">
    import type { TextureEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { TextureEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";
    import { useLoader } from "@threlte/core";
    import { TextureLoader } from "three";

    let {
        composerId,
        textureSrc,
        opacity,
        ...props
    }: EffectProps<TextureEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new TextureEffect(props);

    onMount(() => {
        tick().then(async () => {
            textureSrc && await loadTextureFromSrc(textureSrc);

            $context.push(_effect);
        });

        return () => {
            _effect.dispose();
        };
    });

    $effect(() => {
        if (textureSrc !== undefined)
            loadTextureFromSrc(textureSrc);

        $context.render();
    });


    $effect(() => {
        if (opacity !== undefined)
            _effect.blendMode.setOpacity(opacity);

        $context.render();
    })

    $effect(() => {
        const {
            blendFunction,
            texture,
            // Deprecated
            // aspectCorrection
        } = props;

        if (texture !== undefined)
            _effect.texture = texture;

        if (blendFunction)
            _effect.blendMode.blendFunction = blendFunction;

        $context.render();
    })

    async function loadTextureFromSrc(textureSrc: string | undefined) {
        if (!textureSrc) return;

        const texture = await useLoader(TextureLoader).load(textureSrc);

        if ("encoding" in texture) texture.encoding = 3001; // sRGBEncoding
        // @ts-ignore
        else t.colorSpace = "srgb";

        _effect.texture = texture;
    }
</script>
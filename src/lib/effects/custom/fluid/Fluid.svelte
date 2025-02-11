<script lang="ts">
    import type { FluidProps } from "./types";
    import { Camera, Color, type Group, Mesh, Scene, Texture, Vector2, Vector3 } from "three";
    // import { ShaderPass } from "three/examples/jsm/Addons.js";
    import FluidEffect from "./effect/Fluid.svelte";
    import { FluidEffect as FluidEffectImpl } from "./effect/FluidEffect";
    import { useFBOs } from "./hooks/useFBOs.svelte";
    import { useMaterials } from "./hooks/useMaterials.svelte";
    import { OPTS } from "./constant";
    import { BlendFunction } from "postprocessing";
    import { Portal } from "@threlte/extras";
    import { useThrelte, useTask, T, type Props } from "@threlte/core";
    import { usePointer } from "./hooks/usePointer.svelte";
    import { onMount } from "svelte";

    type Uniforms = {
        uColor: Vector3 | Color;
        uPointer: Vector2;
        uTarget: Texture | null;
        uVelocity: Texture;
        uCurl: Texture;
        uTexture: Texture;
        uPressure: Texture;
        uDivergence: Texture;
        uSource: Texture;
        uRadius: number;
        uClearValue: number;
        uCurlValue: number;
        uDissipation: number;
    };

    const { size, renderer } = useThrelte();

    const bufferScene = $state(new Scene());
    const bufferCamera = $state(new Camera());

    let mesh = $state(new Mesh());
    let post = $state<FluidEffectImpl>();

    let {
        blend = OPTS.blend,
        force = OPTS.force,
        radius = OPTS.radius,
        curl = OPTS.curl,
        swirl = OPTS.swirl,
        intensity = OPTS.intensity,
        distortion = OPTS.distortion,
        fluidColor = OPTS.fluidColor,
        backgroundColor = OPTS.backgroundColor,
        showBackground = OPTS.showBackground,
        rainbow = OPTS.rainbow,
        pressure = OPTS.pressure,
        densityDissipation = OPTS.densityDissipation,
        velocityDissipation = OPTS.velocityDissipation,
        blendFunction = BlendFunction.NORMAL,

        ref = $bindable(),
        children,

        ...props
    }: FluidProps & Props<Group> = $props();

    const FBOs = useFBOs();
    const materials = useMaterials();
    const { onPointerMove, splatStack } = usePointer({ force });

    function setShaderMaterial(name: keyof ReturnType<typeof useMaterials>) {
        if (!mesh) return;

        mesh.material = materials[name];
        mesh.material.needsUpdate = true;
    }

    function setRenderTarget(name: keyof ReturnType<typeof useFBOs>) {
        const target = FBOs[name];

        if ("write" in target) {
            renderer.setRenderTarget(target.write);
            renderer.clear();
            renderer.render(bufferScene, bufferCamera);
            target.swap();
        } else {
            renderer.setRenderTarget(target);
            renderer.clear();
            renderer.render(bufferScene, bufferCamera);
        }
    }

    function setUniforms<K extends keyof Uniforms>(material: keyof ReturnType<typeof useMaterials>,
                                                   uniform: K,
                                                   value: Uniforms[K]) {
        const mat = materials[material];

        if (mat && mat.uniforms[uniform]) {
            mat.uniforms[uniform].value = value;
        }
    }

    onMount(() => {
        console.log(renderer.getRenderTarget());
    })

    useTask(() => {
        if (!mesh) return;

        for (let i = $splatStack.length - 1; i >= 0; i--) {
            const { mouseX, mouseY, velocityX, velocityY } = $splatStack[i];
            // console.log(mouseX, mouseY, velocityX, velocityY);
            setShaderMaterial("splat");
            setUniforms("splat", "uTarget", FBOs.velocity.read.texture);
            setUniforms("splat", "uPointer", new Vector2(mouseX, mouseY));
            setUniforms("splat", "uColor", new Vector3(velocityX, velocityY, 10.0));
            setUniforms("splat", "uRadius", radius / 100.0);
            setRenderTarget("velocity");
            setUniforms("splat", "uTarget", FBOs.density.read.texture);
            setRenderTarget("density");

            $splatStack.pop();
            $splatStack = $splatStack;
        }
        //
        setShaderMaterial("curl");
        setUniforms("curl", "uVelocity", FBOs.velocity.read.texture);
        setRenderTarget("curl");

        setShaderMaterial("vorticity");
        setUniforms("vorticity", "uVelocity", FBOs.velocity.read.texture);
        setUniforms("vorticity", "uCurl", FBOs.curl.texture);
        setUniforms("vorticity", "uCurlValue", curl);
        setRenderTarget("velocity");
        //
        setShaderMaterial("divergence");
        setUniforms("divergence", "uVelocity", FBOs.velocity.read.texture);
        setRenderTarget("divergence");

        setShaderMaterial("clear");
        setUniforms("clear", "uTexture", FBOs.pressure.read.texture);
        setUniforms("clear", "uClearValue", pressure);
        setRenderTarget("pressure");

        setShaderMaterial("pressure");
        setUniforms("pressure", "uDivergence", FBOs.divergence.texture);

        for (let i = 0; i < swirl; i++) {
            setUniforms("pressure", "uPressure", FBOs.pressure.read.texture);
            setRenderTarget("pressure");
        }

        setShaderMaterial("gradientSubstract");
        setUniforms("gradientSubstract", "uPressure", FBOs.pressure.read.texture);
        setUniforms("gradientSubstract", "uVelocity", FBOs.velocity.read.texture);
        setRenderTarget("velocity");

        setShaderMaterial("advection");
        setUniforms("advection", "uVelocity", FBOs.velocity.read.texture);
        setUniforms("advection", "uSource", FBOs.velocity.read.texture);
        setUniforms("advection", "uDissipation", velocityDissipation);

        setRenderTarget("velocity");
        setUniforms("advection", "uVelocity", FBOs.velocity.read.texture);
        setUniforms("advection", "uSource", FBOs.density.read.texture);
        setUniforms("advection", "uDissipation", densityDissipation);

        setRenderTarget("density");

        renderer.setRenderTarget(null);
        renderer.clear();
    });
</script>

<T.Group bind:ref {...props}>
    <Portal object={bufferScene}>
        <T.Mesh
                bind:ref={mesh}
                onpointermove={onPointerMove}
                scale={[$size.width, $size.height, 1]}
        >
            <T.PlaneGeometry args={[2, 2, 10, 10]}/>
        </T.Mesh>
    </Portal>


    <FluidEffect
            bind:ref={post}
            blendFunction={blendFunction}
            intensity={intensity * 0.0001}
            rainbow={rainbow}
            distortion={distortion * 0.001}
            backgroundColor={backgroundColor}
            blend={blend * 0.01}
            fluidColor={fluidColor}
            showBackground={showBackground}
            tFluid={FBOs.density.read.texture}
    />

    {#if ref}
        {@render children?.({ ref })}
    {/if}
</T.Group>

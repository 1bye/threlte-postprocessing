# Threlte Postprocessing

[//]: # (<p align="center">)

[//]: # (  <img width="1200" src="https://raw.githubusercontent.com/1bye/threlte-postprocessing/main/banner.png" alt="Threlte Postprocessing" />)

[//]: # (</p>)

[![Version](https://img.shields.io/npm/v/threlte-postprocessing?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/threlte-postprocessing)
[![Downloads](https://img.shields.io/npm/dt/threlte-postprocessing.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/threlte-postprocessing)
[![License](https://img.shields.io/npm/l/threlte-postprocessing?style=flat&colorA=000000&colorB=000000)](https://github.com/1bye/threlte-postprocessing/blob/main/LICENSE)

Threlte Postprocessing is a postprocessing effects library for [Threlte](https://threlte.xyz/), bringing powerful post-processing capabilities to your Svelte 3D applications. Built on top of [three.js](https://threejs.org/) and [postprocessing](https://github.com/pmndrs/postprocessing), it provides a set of ready-to-use effects that can be easily integrated into your Threlte scenes.

```bash
npm install threlte-postprocessing
```

## Quick start 🚀

```svelte
<script lang="ts">
  import { Canvas } from "@threlte/core";
  import Scene from "./Scene.svelte";
</script>

<Canvas>
  <Scene />
</Canvas>
```

```svelte
<script lang="ts">
  import { EffectComposer } from 'threlte-postprocessing'
  import { DepthOfFieldEffect, BloomEffect, NoiseEffect, VignetteEffect } from 'threlte-postprocessing/effects'
</script>

<EffectComposer>
  <DepthOfFieldEffect focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
  <BloomEffect luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
  <NoiseEffect opacity={0.02} />
  <VignetteEffect eskil={false} offset={0.1} darkness={1.1} />
</EffectComposer>
```

## Demo
Link to [demo](https://codesandbox.io/p/github/1bye/threlte-postprocessing/main)

## Features ✨

- 🎯 Seamless integration with Threlte and Svelte
- ⚡️ Simple, declarative API
- 🎨 Rich set of post-processing effects
- 📦 Tree-shakeable effects
- 🔧 Fully typed with TypeScript
- 🎮 Real-time effect parameter updates

## Effects Documentation 📚

### Bloom
Adds a glow effect to bright areas of the scene.

```svelte
<BloomEffect
  intensity={1.0}           // The intensity of the bloom effect (default: 1.0)
  luminanceThreshold={0.9}  // Minimum luminance required for bloom (default: 0.9)
  luminanceSmoothing={0.025}// Smoothing of the luminance threshold (default: 0.025)
  mipmapBlur={false}       // Whether to use mipmap blur (default: false)
  height={480}             // Render height (default: 480)
/>
```

### BrightnessContrast
Adjusts the brightness and contrast of the scene.

```svelte
<BrightnessContrastEffect
  brightness={0}           // Brightness adjustment (-1 to 1, default: 0)
  contrast={0}            // Contrast adjustment (-1 to 1, default: 0)
/>
```

### ChromaticAberration
Simulates lens color separation artifacts.

```svelte
<ChromaticAberrationEffect
  offset={[0.002, 0.002]}  // RGB offset vector (default: [0.002, 0.002])
  radialModulation={false} // Enable radial offset modulation (default: false)
  modulationOffset={0.15}  // Modulation offset (default: 0.15)
/>
```

### ColorAverage
Reduces the image to a single average color.

```svelte
<ColorAverageEffect />
```

### ColorDepth
Reduces the color depth of the image.

```svelte
<ColorDepthEffect
  bits={16}               // Number of bits per channel (default: 16)
/>
```

### ColorGrading
Applies color adjustments to the final render.

```svelte
<ColorGradingEffect
  lut={texture}            // Color lookup texture
  lutSize={32}            // Size of the lookup texture (default: 32)
  intensity={1.0}         // Effect intensity (default: 1.0)
/>
```

### Depth
Renders the scene's depth buffer.

```svelte
<DepthEffect
  inverted={false}        // Invert the depth values (default: false)
  near={0}               // Near plane distance (default: 0)
  far={1}               // Far plane distance (default: 1)
/>
```

### DepthOfField
Simulates camera focus effects by blurring objects based on their distance from the focal point.

```svelte
<DepthOfFieldEffect
  focusDistance={0.0}      // Distance to the focus point (default: 0.0)
  focalLength={0.02}       // Focal length of the simulated camera (default: 0.02)
  bokehScale={2.0}         // Size of the bokeh effect (default: 2.0)
  height={480}             // Render height (default: 480)
/>
```

### DotScreen
Creates a dot-screen effect similar to halftone printing.

```svelte
<DotScreenEffect
  angle={1.57}            // Pattern angle in radians (default: 1.57)
  scale={1.0}             // Pattern scale (default: 1.0)
/>
```

### Glitch
Creates digital glitch effects.

```svelte
<GlitchEffect
  delay={[1.5, 3.5]}      // Min/max delay between glitches (default: [1.5, 3.5])
  duration={[0.6, 1.0]}   // Min/max glitch duration (default: [0.6, 1.0])
  strength={[0.3, 1.0]}   // Min/max glitch strength (default: [0.3, 1.0])
  mode={GlitchMode.CONSTANT} // Glitch mode (CONSTANT, SPORADIC)
/>
```

### GodRays
Creates volumetric lighting effects.

```svelte
<GodRaysEffect
  decay={0.95}            // Light decay factor (default: 0.95)
  density={0.96}          // Ray density (default: 0.96)
  weight={0.4}            // Ray weight (default: 0.4)
  exposure={0.6}          // Ray exposure (default: 0.6)
  samples={60}            // Number of samples (default: 60)
/>
```

### Grid
Overlays a grid pattern on the scene.

```svelte
<GridEffect
  scale={1.0}             // Grid scale (default: 1.0)
  lineWidth={0.0}         // Grid line width (default: 0.0)
/>
```

### HueSaturation
Adjusts the hue and saturation of the scene.

```svelte
<HueSaturationEffect
  hue={0}                 // Hue adjustment (-Math.PI to Math.PI, default: 0)
  saturation={0}          // Saturation adjustment (-1 to 1, default: 0)
/>
```

### Noise
Adds film grain or noise to the scene.

```svelte
<NoiseEffect
  opacity={0.02}           // Noise opacity (default: 0.02)
  premultiply={false}      // Whether to premultiply the noise (default: false)
  blendFunction={BlendFunction.SCREEN} // Blend mode for the noise
/>
```

### Pixelation
Creates a pixelated effect by reducing the resolution.

```svelte
<PixelationEffect
  granularity={5}         // Size of pixels (default: 5)
/>
```

### Scanline
Adds scanlines to the scene, similar to old CRT displays.

```svelte
<ScanlineEffect
  density={1.25}          // Line density (default: 1.25)
/>
```

### Sepia
Applies a sepia tone to the scene.

```svelte
<SepiaEffect
  intensity={1.0}         // Effect intensity (default: 1.0)
/>
```

### SMAA (Subpixel Morphological Antialiasing)
Provides high-quality antialiasing.

```svelte
<SMAAEffect
  preset={SMAAPreset.HIGH} // Quality preset (LOW, MEDIUM, HIGH, ULTRA)
  edgeDetectionMode={EdgeDetectionMode.COLOR} // Detection mode (COLOR, DEPTH, LUMA)
/>
```

### ToneMapping
Applies tone mapping to the scene.

```svelte
<ToneMappingEffect
  mode={ToneMappingMode.REINHARD} // Tone mapping mode (REINHARD, OPTIMIZED, ACES, HEJL)
  exposure={1.0}          // Exposure level (default: 1.0)
  maxLuminance={16.0}     // Maximum luminance (default: 16.0)
  middleGrey={0.6}        // Middle grey point (default: 0.6)
  whitePoint={16.0}       // White point (default: 16.0)
/>
```

### Vignette
Darkens the edges of the scene.

```svelte
<VignetteEffect
  offset={0.5}             // Offset of the effect (default: 0.5)
  darkness={0.5}           // Intensity of the darkening (default: 0.5)
  eskil={false}            // Use Eskil's vignette technique (default: false)
/>
```

### Custom Fluid Effect
Fluid like in [react-fluid](https://github.com/whatisjery/react-fluid-distortion/tree/main)
```svelte
<script lang="ts">
    import { FluidEffect } from "threlte-postprocessing/custom";
</script>

<!-- Don't forget to wrap it with <EffectComposer>! -->
<FluidEffect />
```

### And more...
You can check more effects in [effects folder](./src/lib/effects)

## Contributing 🤝

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-effect`)
3. Commit your changes (`git commit -m 'Add amazing effect'`)
4. Push to the branch (`git push origin feature/amazing-effect`)
5. Open a Pull Request

## Performance Tips 💨

- Only use the effects you need
- Adjust effect quality settings based on device capabilities
- Consider using the `<EffectComposer>` component for better control
- Enable effect pass switching for dynamic performance optimization

## Credits 🙏

This library builds upon several amazing projects:
- [Threlte](https://threlte.xyz/)
- [three.js](https://threejs.org/)
- [postprocessing](https://github.com/pmndrs/postprocessing)

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ for the Threlte and Svelte community</p>
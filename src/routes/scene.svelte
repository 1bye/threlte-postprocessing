<script lang="ts">
	import { T } from '@threlte/core';
	import { interactivity, useTexture } from '@threlte/extras';
	import { EffectComposer } from '$lib';
	import { Fluid } from '$lib/effects/custom';
	import { GridEffect } from '$lib/effects';

	interactivity();

	const texture = useTexture("img.jpg");
</script>

<EffectComposer>
	<Fluid />
	<GridEffect scale={0.4} />
<!--	<ASCIIEffect />-->
</EffectComposer>

{#await texture then map}
	<T.Mesh position.z={-4}>
		<T.PlaneGeometry args={[7, 10, 20, 20]} attach="geometry" />
		<T.MeshBasicMaterial {map} color="#d5cfc9"/>
	</T.Mesh>
{/await}

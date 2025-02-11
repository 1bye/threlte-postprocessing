import * as THREE from "three";

import { useFBO } from "@threlte/extras";
import { useDoubleFBO } from "./useDoubleFBO.svelte";
import { OPTS } from "../constant";

export const useFBOs = () => {
    const density = useDoubleFBO(OPTS.dyeRes, OPTS.dyeRes, {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
        minFilter: THREE.LinearFilter,
        depth: false,
    });

    const velocity = useDoubleFBO(OPTS.simRes, OPTS.simRes, {
        type: THREE.HalfFloatType,
        format: THREE.RGFormat,
        minFilter: THREE.LinearFilter,
        depth: false,
    });

    const pressure = useDoubleFBO(OPTS.simRes, OPTS.simRes, {
        type: THREE.HalfFloatType,
        format: THREE.RedFormat,
        minFilter: THREE.NearestFilter,
        depth: false,
    });

    const divergence = useFBO({
        size: {
            width: OPTS.simRes,
            height: OPTS.simRes,
        },
        type: THREE.HalfFloatType,
        format: THREE.RedFormat,
        minFilter: THREE.NearestFilter,
        depth: false,
    });

    const curl = useFBO({
        size: {
            width: OPTS.simRes,
            height: OPTS.simRes,
        },
        type: THREE.HalfFloatType,
        format: THREE.RedFormat,
        minFilter: THREE.NearestFilter,
        depth: false,
    });

    const FBOs = $state({
        density,
        velocity,
        pressure,
        divergence,
        curl,
    });

    $effect(() => {
        // return () => {
        //     for (const FBO of Object.values(FBOs)) {
        //         FBO.dispose();
        //     }
        // };
    })

    return FBOs;
};
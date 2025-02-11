import type { EventMap } from "@threlte/extras";
import { Vector2 } from "three";
import { useThrelte } from "@threlte/core";
import { get, writable } from "svelte/store";

type SplatStack = {
    mouseX?: number;
    mouseY?: number;
    velocityX?: number;
    velocityY?: number;
};

export function usePointer({ force }: { force: number }) {
    const FORCE = 200;

    const { size: _size } = useThrelte();

    const splatStack = writable<SplatStack[]>([]);
    const lastMouse = writable(new Vector2());

    const onPointerMove = (event: EventMap["onpointermove"]) => {
        const size = _size.current;

        const pointer = event.pointer;

        const screenX = (pointer.x + 1) * 0.5 * size.width;
        const screenY = (pointer.y + 1) * 0.5 * size.height;

        const mouseX = screenX / size.width;
        const mouseY = screenY / size.height;

        const deltaX = mouseX - get(lastMouse).x;
        const deltaY = mouseY - get(lastMouse).y;

        const velocityX = deltaX * (force * FORCE);
        const velocityY = -deltaY * (force * FORCE);

        lastMouse.update(value => value.set(mouseX, mouseY));

        splatStack.update(value => {
            value.push({
                mouseX,
                mouseY,
                velocityX,
                velocityY,
            });

            // console.log({
            //     mouseX,
            //     mouseY,
            //     velocityX,
            //     velocityY,
            // });

            return value;
        });
    };

    return {
        onPointerMove,
        splatStack,
    };
}
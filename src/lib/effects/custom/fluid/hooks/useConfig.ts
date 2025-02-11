import { OPTS } from "../constant";

export function useConfig() {
    return $state(OPTS);
}
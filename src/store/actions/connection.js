import { SET_CONNECTION } from "./actionTypes";

export const setFastConnection = () => ({
    type: SET_CONNECTION,
    connectionState: 'fast',
});

export const setSlowConnection = () => ({
    type: SET_CONNECTION,
    connectionState: 'slow',
});

export const setNoConnection = () => ({
    type: SET_CONNECTION,
    connectionState: 'no',
});
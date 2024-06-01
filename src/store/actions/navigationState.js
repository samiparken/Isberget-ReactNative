import { SET_ACTIVE_PAGE } from "./actionTypes";

export const setActivePage = page => ({
    type: SET_ACTIVE_PAGE,
    payload: page,
});
export enum Window {
    REGISTER = 'registerWindow',
    LOGIN = 'loginWindow',
    HUD = 'hudWindow',
    CHARACTER_CREATION = 'characterCreationWindow',
}

export interface WindowState {
    windowName: Window;
    state: boolean;
}

export type WindowsMapper = Map<Window, boolean>;

export const WINDOW_EVENTS = {
    CHANGE_STATE_WINDOW: 'browser:changeStateWindow',
}
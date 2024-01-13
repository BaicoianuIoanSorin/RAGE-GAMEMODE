export interface WindowsOpened {
  registerWindow: boolean;
  loginWindow: boolean;
  chatWindow: boolean;
}

export const defaultWindowsOpened: WindowsOpened = {
  registerWindow: false, // only displayed when the player is not logged in
  loginWindow: false, // only displayed when the player is not logged in
  chatWindow: false, // always displayed
};
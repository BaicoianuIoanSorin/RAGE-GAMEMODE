export interface WindowsOpened {
  registerWindow: boolean;
  loginWindow: boolean;
  hudWindow: boolean;
}

export const defaultWindowsOpened: WindowsOpened = {
  registerWindow: false, // only displayed when the player is not logged in
  loginWindow: false, // only displayed when the player is not logged in
  // always displayed
  hudWindow: true,
};
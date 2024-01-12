export interface WindowsOpened {
  registerWindow: boolean;
  loginWindow: boolean;
}

export const defaultWindowsOpened: WindowsOpened = {
  registerWindow: false,
  loginWindow: false,
};
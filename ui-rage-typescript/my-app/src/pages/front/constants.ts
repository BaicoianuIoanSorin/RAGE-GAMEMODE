import { Window, WindowsMapper } from "../../utils/events-constants/windows.constants";

export const defaultWindowsOpened:  Map<string, boolean> = new Map<string, boolean>([
  [Window.REGISTER, false],
  [Window.LOGIN, false],
  [Window.HUD, false],
  [Window.CHARACTER_CREATION, false]
]);
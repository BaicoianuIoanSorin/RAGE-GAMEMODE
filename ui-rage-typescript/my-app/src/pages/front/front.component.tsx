import Logo from "../../components/logo/logo.component";
import { useToast } from "@chakra-ui/react";
import {
  WINDOW_EVENTS,
  Window,
  WindowState,
  WindowsMapper,
} from "../../utils/events-constants/windows.constants";
import { defaultWindowsOpened } from "./constants";
import { useState } from "react";
import Login from "../../components/authentication/login/login.component";
import { makeToast } from "../../utils/components-used/toast";
import Register from "../../components/authentication/register/register.component";
import { HudComponent } from "../../components/hud/hud.component";
import { CharacterCreationComponent } from "../../components/character-creation/character-creation.component";

const Front = () => {
  const [windowsMap, setWindowsMap] = useState<Map<string, boolean>>(defaultWindowsOpened);

  let rpc: any = null;
  if ("rpc" in window && "callClient" in window.rpc) {
    rpc = window.rpc;
  }

  const toast = useToast();

  const handleToastsForWindowState = (windowInfo: WindowState): void => {
    makeToast(
      rpc,
      toast,
      `Windows displayed changed for ${windowInfo.windowName}`,
      `Login window ${windowInfo.state ? "Opened" : "Closed"}`,
      "info"
    );
  };

  const handleWindowChange = (windows: WindowState[]): void => {
      let windowsMapCopy = new Map(windowsMap);
      windows.forEach((window: WindowState) => {
          windowsMapCopy.set(window.windowName, window.state);
          handleToastsForWindowState(window);
      });
      setWindowsMap(windowsMapCopy);
  };
  
  // TODO refactor this to handle only open window
  window.rpc.on(WINDOW_EVENTS.CHANGE_STATE_WINDOW, (windowsJson) => {
    const windows: WindowState[] = JSON.parse(windowsJson);
    handleWindowChange(windows);
  });

  return (
    <div className="front-container">
      {windowsMap.get(Window.HUD) && <HudComponent />}
      {windowsMap.get(Window.LOGIN) && (
        <Login
          handleRegisterClick={() =>
            handleWindowChange([
              {
                windowName: Window.LOGIN,
                state: false,
              },
              {
                windowName: Window.REGISTER,
                state: true,
              },
            ])
          }
        />
      )}
      {windowsMap.get(Window.REGISTER) && (
        <Register
          handleLoginClick={() =>
            handleWindowChange([
              {
                windowName: Window.REGISTER,
                state: false,
              },
              {
                windowName: Window.LOGIN,
                state: true,
              },
            ])
          }
        />
      )}
      {windowsMap.get(Window.CHARACTER_CREATION) && (
        <CharacterCreationComponent/>
      )}
      <Logo />
    </div>
  );
};

export default Front;

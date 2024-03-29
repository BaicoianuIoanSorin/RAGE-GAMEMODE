import Logo from "../../components/logo/logo.component";
import { useToast } from "@chakra-ui/react";
import {
  WINDOW_EVENTS,
  WINDOW_OPENED,
} from "../../utils/events-constants/windows.constants";
import { WindowsOpened, defaultWindowsOpened } from "./constants";
import { useState } from "react";
import Login from "../../components/authentication/login/login.component";
import { makeToast } from "../../utils/components-used/toast";
import Register from "../../components/authentication/register/register.component";
import { HudComponent } from "../../components/hud/hud.component";

const Front = () => {
  const [windowsOpened, setWindowsOpened] = useState(defaultWindowsOpened);

  function handleWindowChange(windows: WINDOW_OPENED[]): void {
    setWindowsOpened((prevWindows) => {
      const updatedWindows = { ...prevWindows };
      windows.forEach(window => {
        updatedWindows[window as keyof WindowsOpened] = !updatedWindows[window as keyof WindowsOpened];
      });
      return updatedWindows;
    });
  }

  const toast = useToast();
  if ("rpc" in window && "callClient" in window.rpc) {
    window.rpc.on(WINDOW_EVENTS.OPEN_WINDOW, (windowOpened) => {
      switch (windowOpened) {
        case WINDOW_OPENED.LOGIN: {
          handleWindowChange([WINDOW_OPENED.LOGIN]);
          break;
        }
      }
    });

    window.rpc.on(WINDOW_EVENTS.CLOSE_WINDOW, (windowClosed) => {
      switch (windowClosed) {
        case WINDOW_OPENED.LOGIN: {
          handleWindowChange([WINDOW_OPENED.LOGIN, WINDOW_OPENED.HUD]);
          break;
        }
        case WINDOW_OPENED.REGISTER: {
          handleWindowChange([WINDOW_OPENED.REGISTER]);
          makeToast(
            window.rpc,
            toast,
            "Account info",
            "We've created your account for you.",
            "success"
          );
          break;
        }
      }
    });
  }
  return (
    <div className="front-container">
      {windowsOpened.hudWindow && (<HudComponent/>)}
      {windowsOpened.loginWindow && (
        <Login
          handleRegisterClick={() =>
            handleWindowChange([WINDOW_OPENED.REGISTER,WINDOW_OPENED.LOGIN])
          }
        />
      )}
      {
        windowsOpened.registerWindow && (
          <Register
            handleLoginClick={() =>
              handleWindowChange([WINDOW_OPENED.REGISTER,WINDOW_OPENED.LOGIN])
            }
          />
        )
      }
      <Logo />
    </div>
  );
};

export default Front;

import Logo from "../../components/logo/logo.component";
import { useToast } from "@chakra-ui/react";
import {
  WINDOW_EVENTS,
  WINDOW_OPENED,
} from "../../utils/events-constants/windows.constants";
import { defaultWindowsOpened } from "./constants";
import { useState } from "react";
import Login from "../../components/authentication/login.component";
import { makeToast } from "../../utils/components-used/toast";

const Front = () => {
  const [windowsOpened, setWindowsOpened] = useState(defaultWindowsOpened);

  const toast = useToast();
  if ("rpc" in window && "callClient" in window.rpc) {
    window.rpc.on(WINDOW_EVENTS.OPEN_WINDOW, (windowOpened) => {
     switch (windowOpened) {
        case WINDOW_OPENED.LOGIN: {
          setWindowsOpened({ ...windowsOpened, loginWindow: true });
          break;
        }
      }
    });

    window.rpc.on(WINDOW_EVENTS.CLOSE_WINDOW, (windowClosed) => {
      switch (windowClosed) {
        case WINDOW_OPENED.LOGIN: {
          setWindowsOpened({ ...windowsOpened, loginWindow: false });
          console.log(windowsOpened);
          break;
        }
        case WINDOW_OPENED.REGISTER: {
          setWindowsOpened({ ...windowsOpened, registerWindow: false });
          makeToast(window.rpc, toast, "Account info", "We've created your account for you.", "success");
          console.log(windowsOpened);
          break;
        }
      }
    });
  }
  return (
    <div className="front-container">
      {windowsOpened.loginWindow && <Login />}
      <Logo />
    </div>
  );
};

export default Front;

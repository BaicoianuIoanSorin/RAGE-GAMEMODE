import { Button } from "@chakra-ui/button";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/input";
import { Box, Stack } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { EmailIcon, LockIcon } from "@chakra-ui/icons";
import {
  GENERAL_STATUS_CODES,
  LOGIN_STATUS_CODES,
} from "../../../utils/status-codes/status-codes.constants";
import { AUTH } from "../../../utils/authentication/events.constants";

import { makeToast } from "../../../utils/components-used/toast";
import { useToast } from "@chakra-ui/react";

import "./login.component.scss";
import { CLIENT_PLAYER_EVENTS } from "../../../utils/player/events.constants";
import { IPlayerInfo } from "../../../utils/player/IPlayerInfo";
const defaultFormFields = {
  password: "",
};

interface LoginProps {
  handleRegisterClick: () => void;
}

const Login = (props: LoginProps) => {
  const toast = useToast();

  const [isVisible, setIsVisible] = useState(true);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { password } = formFields;
  const [isSubmittingDisabled, setIsSubmittingDisabled] = useState(true);
  const [show, setShow] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState({
    username: '',
    currentId: -1,
  });

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  useEffect(() => {
    if ("rpc" in window && "callClient" in window.rpc) {
      window.rpc
        .callClient(CLIENT_PLAYER_EVENTS.GET_PLAYER_INFO)
        .then((response) => {
          const playerResponse: IPlayerInfo = JSON.parse(response);
          setCurrentPlayer({...playerResponse});
        });
    }
  }, []);

  useEffect(() => {
    if (password) {
      setIsSubmittingDisabled(false);
    } else {
      setIsSubmittingDisabled(true);
    }
  }, [password]);

  useEffect(() => {
    if (!isVisible) {
      const fadeOutTimer = setTimeout(() => {
        // Do any cleanup or further actions after the fade-out here, if needed.
      }, 3000); // You can adjust the duration of the fade-out here (in milliseconds).
      // Return a cleanup function to clear the timer when the component unmounts or when isVisible becomes true again.
      return () => clearTimeout(fadeOutTimer);
    }
  }, [isVisible]);

  const handleChange = (event: any) => {
    const { id, value } = event.target;
    setFormFields({ ...formFields, [id]: value });
  };

  const onSubmit = async (event: any) => {
    if ("rpc" in window && "callClient" in window.rpc) {
      const formFieldsJSON = JSON.stringify(formFields);
      let response = await window.rpc.callClient(
        AUTH.CLIENT_LOGIN,
        formFieldsJSON
      );
      if (response === GENERAL_STATUS_CODES.OK) {
        window.rpc.triggerClient(AUTH.CLIENT_LOGIN_SUCCES);
        makeToast(
          window.rpc,
          toast,
          "Account info",
          "You've successfully logged in.",
          "success"
        );
        setIsVisible(false);
      } else if (Object.values(LOGIN_STATUS_CODES).includes(response)) {
        makeToast(window.rpc, toast, "Account info", response, "warning");
      } else if (Object.values(GENERAL_STATUS_CODES).includes(response)) {
        makeToast(window.rpc, toast, "Account info", response, "error");
      }
    } else {
      makeToast(
        window.rpc,
        toast,
        "Account info",
        "You've successfully logged in.",
        "success"
      );
    }
  };

  const handleClick = () => setShow(!show);

  const handleKeyDown = (event: any) => {
    console.log(event);
    if (event.key === "Enter" && !isSubmittingDisabled) {
      onSubmit(event);
    }
  };

  return (
    <Box
      className="box-container"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 3s ease-in-out, background-color 3s ease-in-out",
        backgroundColor: isVisible ? "white" : "rgba(237, 247, 95, 0.1)",
      }}
    >
      <div className="background-image"></div>
      <Stack
        className="authentication-container"
        spacing={4}
        bg="white"
        maxW="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        color="black"
      >
        <h2>Login</h2>
        {currentPlayer.currentId !== -1 && (
          <p>
          Your name: <span
            style={{
              fontWeight: "bold",
            }}
          >
            {currentPlayer.username}
          </span>
        </p>
        )}
        <div className="form-item">
          <InputGroup size="md">
            <InputLeftElement pointerEvents="none">
              <LockIcon color="gray.300" />
            </InputLeftElement>
            <Input
              id="password"
              value={password}
              pr="4.5rem"
              type={show ? "text" : "password"}
              required
              placeholder="Enter password"
              onChange={handleChange}
              onKeyDown={handleKeyDown} // Add this line
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </div>
        <p>
          Don't have an account?
          <span onClick={props.handleRegisterClick}>Register</span>
        </p>
        <Button onClick={onSubmit} isDisabled={isSubmittingDisabled}>
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export default Login;

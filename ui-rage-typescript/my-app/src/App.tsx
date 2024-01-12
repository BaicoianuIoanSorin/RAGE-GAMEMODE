import * as React from "react";
import { ChakraProvider, Switch, theme } from "@chakra-ui/react";
import { Routes, Route, Router } from "react-router-dom";
import Authentication from "./components/authentication/login/login.component";
import Logo from "./components/logo/logo.component";
import Front from "./pages/front/front.component";
import './App.scss';

export const App = () => (
  <ChakraProvider theme={theme}>
    <Routes>
          <Route index element={<Front />} />
    </Routes>
  </ChakraProvider>
);

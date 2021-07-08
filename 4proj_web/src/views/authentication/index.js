import React, { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./../../components/authentication/login";
import Register from "./../../components/authentication/register";
import { register, login, setInLocalStorage } from "./../../common/requests/requests";

export default function IndexAuthentication() {
  const [RegistrationConfirmation, setRegistrationConfirmation] = useState({});
  const [RegistrationErrors, setRegistrationErrors] = useState({});

  const [LoginConfirmation, setLoginConfirmation] = useState({});
  const [LoginErrors, setLoginErrors] = useState({});

  const registerNew = async (data) => {
    const registerResult = await register(data);
    if (registerResult.status === 201) {
      setInLocalStorage("auth", true);
      setInLocalStorage("userId", registerResult.message.id);
      setRegistrationConfirmation({ message: "OK" });
      setRegistrationErrors({});
    } else {
      setRegistrationErrors(registerResult.message);
    }
  };

  const logNew = async (data) => {
    const loginResult = await login(data);
    if (loginResult.status === 200) {
      setInLocalStorage("auth", true);
      setInLocalStorage("userId", loginResult.message._id);
      setLoginConfirmation({ message: "OK" });
      setLoginErrors({});
    } else {
      setLoginErrors(loginResult.message);
    }
  };

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Login submit={logNew} errors={LoginErrors} confirmation={LoginConfirmation} />
        </Route>
        <Route exact path="/register">
          <Register submit={registerNew} errors={RegistrationErrors} confirmation={RegistrationConfirmation} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

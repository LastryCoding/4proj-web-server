import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import PrivateRoute from "../components/layout/privateRoute";
import IndexAuthentication from "./authentication";
import IndexHome from "./home";

export default function Index() {
  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute path="/home">
          <IndexHome />
        </PrivateRoute>
        <Route path="/*">
          <IndexAuthentication />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

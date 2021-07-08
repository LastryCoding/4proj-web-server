import React from "react";
import "./App.css";
import Index from "./views/index";
import axios from "axios";

// axios.defaults.baseURL = "http://localhost:3333";
axios.defaults.baseURL = "https://proj4supinfobackend.herokuapp.com/";
axios.defaults.withCredentials = true;

function App() {
  return <Index />;
}

export default App;

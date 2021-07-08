import React, { useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { getInLocalStorage } from "../../common/requests/requests";

export default function Login(props) {
  useEffect(() => {
    const checkLocalStorage = async () => {
      const auth = await getInLocalStorage("auth");
      if (auth === "true") {
        window.location.href = "/home";
      }
    };
    checkLocalStorage();
  }, [props.confirmation]);

  const submitData = (e) => {
    e.preventDefault();
    try {
      var data = {};
      data.email = document.getElementById("email").value;
      data.password = document.getElementById("password").value;
      props.submit(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className=""
      style={{ backgroundImage: "url(/supermarket1.jpg)", backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "cover" }}
    >
      <div className="container mx-auto pt-4 px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 pt-4 text-center mb-3 font-bold">
                  <p className="uppercase">Sign in</p>
                </div>
                <Form onSubmit={submitData}>
                  <div className="relative w-full mb-3">
                    <Form.Group>
                      <Form.Label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                        Email
                      </Form.Label>
                      <Form.Control
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="email"
                        // isInvalid={props.errors.email ? true : false}
                        type="text"
                        placeholder="Email"
                      ></Form.Control>
                      {/* <Form.Control.Feedback type="invalid">{props.errors.email}</Form.Control.Feedback> */}
                    </Form.Group>
                  </div>

                  <div className="relative w-full mb-3">
                    <Form.Group>
                      <Form.Label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                        Password
                      </Form.Label>
                      <Form.Control
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="password"
                        // isInvalid={props.errors.password ? true : false}
                        type="password"
                        placeholder="Password"
                      ></Form.Control>
                      {/* <Form.Control.Feedback type="invalid">{props.errors.password}</Form.Control.Feedback> */}
                    </Form.Group>
                  </div>

                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        I agree with the{" "}
                        <a href="#pablo" className="text-lightBlue-500" onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>

                  <div className="text-center mt-6">
                    <Button
                      variant="transparent"
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Log in
                    </Button>
                  </div>
                  <div className="text-center py-4">
                    <p> Don't have an account yet ? </p>{" "}
                    <a href="/register" className="no- text-blueGray-700 hover:text-blueGray-800 uppercase">
                      Sign up
                    </a>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

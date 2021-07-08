import React, { useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Cart, CartFill } from "react-bootstrap-icons";

export default function NavigationBar({ user, cart }) {
  useEffect(() => {}, [cart]);
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/home">
        <img src="/logo.png" width="50" className="d-inline-block align-top" alt="logo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/home">Home</Nav.Link>
        </Nav>
        <Nav className="justify-content-end" activeKey="/home">
          <Nav.Item>
            <Nav.Link href="/home/cart">
              {cart && cart.items && cart.items.length > 0 ? (
                <div className="inline-flex">
                  <CartFill size={26} color="green" />
                  <p className="font-bold"> {cart.items.length} </p>
                </div>
              ) : (
                <Cart size={26} color="blue" className="mr-2" />
              )}
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

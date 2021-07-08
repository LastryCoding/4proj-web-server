import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import MainNavigation from "./../navigation/mainNav";
import SideNav from "./../navigation/sideNav";
import { menu } from "./../../common/menu";

export default function Layout({ children, user, myCart, myNotif }) {
  const [MyCart, setMyCart] = useState([]);
  const [MyNotif, setMyNotif] = useState([]);

  useEffect(() => {
    setMyCart(myCart);
    setMyNotif(myNotif);
  }, [user, myNotif, myCart]);

  return (
    <Container className="p-0">
      <Row className="m-0">
        <Col lg="12" className="p-0">
          <MainNavigation user={user} cart={MyCart} />
        </Col>
      </Row>
      <Row className="m-0">
        <Col lg="2" id="sideNav">
          <SideNav menu={menu} user={user} notif={MyNotif} />
        </Col>
        <Col lg="10" className="mb-4">
          <Row className="mt-4">
            <Col lg="12">{children}</Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

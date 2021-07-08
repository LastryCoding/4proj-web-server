import React from "react";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import { numberWithCommas } from "./../../../common/requests/requests";

export default function ViewProfile({ user, submitUpdateUser }) {
  const submitData = async (e) => {
    e.preventDefault();
    let newUser = {
      ...user,
    };
    newUser.money = parseInt(document.getElementById("newMoney").value);
    newUser.fullName = document.getElementById("newFullName").value;
    await submitUpdateUser(newUser, newUser._id);
  };

  if (user.email) {
    return (
      <Card className="homeCards">
        <Card.Header as="h4" className="blue-heading">
          Mon profil
        </Card.Header>

        <Card.Body>
          <Row>
            <Col lg="12">
              <Row className="justify-content-md-center">
                <Col lg={10} className="mx-auto mb-4">
                  <h2 className="font-semibold">Récapitulatif de mon profil :</h2>
                  <p className="text-center font-semibold">Email : {user.email}</p>
                  <p className="text-center font-semibold">Role : {user.role}</p>
                  <p className="text-center font-semibold">Nom : {user.fullName}</p>
                  <p className="text-center font-semibold">Argent : € {numberWithCommas(user.money)}</p>
                </Col>
                <br />
                <Col lg={10}>
                  <h2 className="font-semibold mb-2">Modification de mon profil :</h2>
                  <Form id="formReset" onSubmit={submitData}>
                    <Form.Group>
                      <Form.Label>Nom :</Form.Label>
                      <Form.Control id="newFullName" type="text" placeholder={user.fullName} />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Argent :</Form.Label>
                      <Form.Control id="newMoney" type="number" placeholder={user.money} min={1} step={1} />
                    </Form.Group>
                    <Button type="submit" variant="success">
                      Modifier
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  } else {
    return (
      <Card className="homeCards">
        <Card.Header as="h4" className="blue-heading">
          Mon profile
        </Card.Header>

        <Card.Body>
          <Row>
            <Col lg="12">
              <Row>
                <Col lg={10} className="mx-auto">
                  Chargement...
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

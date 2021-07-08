import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import Dashboard from "./dashboard";

export default function Index({ user, myItems, myItemsBuy, myTransactions, init, confirmation, fetching }) {
  const initDb = () => {
    init();
  };

  if (myItems && myTransactions && user.role) {
    if (user.role !== "CLIENT") {
      return (
        <Card className="homeCards">
          <Card.Header as="h1" className="blue-heading">
            Bienvenue sur votre plateforme de produits et services.
          </Card.Header>

          <Card.Body>
            {myItems.length === 0 ? (
              <Row>
                <Col lg="6">
                  <div className="">
                    <p>
                      Puisque c'est votre premiere connection en tant que <span className="font-bold">{user.role}</span>, vous devez initialiser votre
                      inventaire.
                    </p>
                    <p>
                      Pour cela veuillez cliquer sur le bouton d'initialisation afin d'avoir un certain inventaire que vous devrez gérer par la suite.
                    </p>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="justify-content-md-center">
                    <Button onClick={initDb}>Initialisation de l'inventaire</Button>
                  </div>
                </Col>
              </Row>
            ) : null}
            {confirmation ? (
              <Row>
                <Col lg="12">
                  <p>Inventaire initialisé avec succès!</p>
                </Col>
              </Row>
            ) : null}
            <Row>
              {/* <Dashboard /> */}
            </Row>
          </Card.Body>
        </Card>
      );
    } else {
      return (
        <Card className="homeCards">
          <Card.Header as="h1" className="blue-heading">
            Bienvenue sur votre plateforme de produits et services.
          </Card.Header>

          <Card.Body>
            <Row>
              {/* <Dashboard /> */}
            </Row>
          </Card.Body>
        </Card>
      );
    }
  } else {
    return (
      <Card className="homeCards">
        <Card.Header as="h1" className="blue-heading">
          Bienvenue sur votre plateforme de produits et services.
        </Card.Header>

        <Card.Body>
          <p>Chargement...</p>
        </Card.Body>
      </Card>
    );
  }
}

import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import OneShelve from "./oneShelve";

export default function ClientViewAllShelves({ user, data }) {
  const [Shelves, setShelves] = useState([]);

  useEffect(() => {
    setShelves(data);
  }, [data]);

  if (Shelves && Shelves.length >= 0) {
    return (
      <Card className="homeCards">
        <Card.Header as="h4" className="blue-heading">
          Rayons
        </Card.Header>
        <Card.Body>
          {Shelves.length > 0 ? (
            <Row>
              {Shelves.map((element, i) => (
                <Col className="mb-3" lg="3" key={i}>
                  <OneShelve
                    id={element._id}
                    title={element.name}
                    text={`Ce rayon a ${element.items.length} produit(s)`}
                    viewLink={`/home/browse/${element._id}`}
                    alertDate={element.alertDate}
                    alertQuantity={element.alertQuantity}
                    sensor={element.sensor}
                    role={user.role}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Row>
              <Col lg={12} className="mt-2">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p>Aucun rayon n'est présenté.</p>
                </div>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
    );
  } else {
    return (
      <Card className="homeCards">
        <Card.Header as="h4" className="blue-heading">
          Mes rayons
        </Card.Header>

        <Card.Body>
          <Row>
            <Col lg="12">
              <p>Chargement...</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

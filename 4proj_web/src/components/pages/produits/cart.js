import React, { useEffect, useState } from "react";
import { Row, Col, Table, Button, Card } from "react-bootstrap";
import { numberWithCommas } from "./../../../common/requests/requests";

export default function MyCart({ form, user, data, deleteFct, buyItems, confirmationErrors }) {
  const [CurrentData, setCurrentData] = useState();

  useEffect(() => {
    setCurrentData(data);
  }, [data, confirmationErrors]);

  const deleteOne = (id, name) => {
    if (window.confirm(`Voulez vous enlever ${name.toUpperCase()} du panier ?`)) {
      deleteFct(data, id);
    }
  };
  const submitData = (e) => {
    e.preventDefault();
    buyItems(data);
  };

  const getTotalCart = () => {
    let totalCart = 0;
    for (let i = 0; i < CurrentData.items.length; i++) {
      const item = CurrentData.items[i];
      totalCart += item.quantity * (user.role === "CLIENT" ? 3 : 2) * item.item.coefPrice;
    }
    return totalCart;
  };

  if (user.role && data && CurrentData) {
    return (
      <Card className="homeCards">
        <Card.Header as="h4" className="blue-heading">
          {form.title}
        </Card.Header>
        <Card.Body>
          {CurrentData.items && CurrentData.items.length > 0 ? (
            <Row>
              <Col lg="12">
                <Table striped bordered hover responsive>
                  <thead style={{ textAlign: "center" }}>
                    <tr>
                      <th>Nom</th>
                      <th>Catégorie</th>
                      <th>Description</th>
                      <th>Quantité</th>
                      <th>Date péremption</th>
                      <th>Prix</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CurrentData.items.map((element) => (
                      <tr key={element._id}>
                        <td style={{ maxWidth: "150px", textAlign: "center" }}>{element.item.labels}</td>
                        <td style={{ maxWidth: "150px", textAlign: "center" }}>{element.item.level1}</td>
                        <td style={{ maxWidth: "150px", textAlign: "center" }}>{element.item.level2}</td>
                        <td style={{ maxWidth: "75px", textAlign: "center" }}>{numberWithCommas(element.quantity)}</td>
                        <td style={{ maxWidth: "75px", textAlign: "center" }}>
                          <span className="font-semibold">{element.item.datePeremption}</span> jours
                        </td>
                        <td style={{ maxWidth: "75px", textAlign: "center" }}>
                          <span className="font-semibold">
                            € {numberWithCommas(element.quantity * (user.role === "CLIENT" ? 3 : 2) * element.item.coefPrice)}
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <Button onClick={() => deleteOne(element._id, element.item.labels)} variant="danger">
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
              <Col lg={12}>
                <p className="text-center text-xl font-bold mb-2">Total du panier : €{numberWithCommas(getTotalCart())}</p>
              </Col>
              <Col lg={12}>
                <Row className="justify-content-md-center">
                  <Col lg={4}>
                    <Button onClick={submitData} variant="success" className="w-full">
                      Valider mon panier!
                    </Button>
                  </Col>
                </Row>
              </Col>
              {confirmationErrors ? (
                <Col lg={12} className="mt-4">
                  {typeof confirmationErrors !== "string" ? (
                    Object.keys(confirmationErrors).map((key, i) => (
                      <p key={i} style={{ color: "red" }}>
                        {`-> ${confirmationErrors[key]}`}
                      </p>
                    ))
                  ) : (
                    <p style={{ color: "red" }}>{`-> ${confirmationErrors}`}</p>
                  )}
                </Col>
              ) : null}
            </Row>
          ) : (
            <Col lg={12}>
              <Row>
                <div>
                  <p>Votre panier est vide pour le moment</p>
                </div>
              </Row>
              <Row className="justify-content-md-center">
                <Col lg={4}>
                  <a href="/home/browse" style={{ textDecoration: "none" }} className="hover:text-red-500">
                    <Button variant="info">Acheter de nouveaux produits</Button>
                  </a>
                </Col>
              </Row>
            </Col>
          )}
        </Card.Body>
      </Card>
    );
  } else {
    return (
      <Card className="homeCards">
        <Card.Header as="h4" className="blue-heading">
          {form.title}
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

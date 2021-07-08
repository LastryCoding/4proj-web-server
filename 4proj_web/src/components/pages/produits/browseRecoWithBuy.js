import React, { useEffect, useState } from "react";
import { Row, Col, Form, Modal, Table, Button } from "react-bootstrap";
import { Cart } from "react-bootstrap-icons";
import { numberWithCommas } from "./../../../common/requests/requests";

export default function Browse({ user, data, submitFct, confirmation }) {
  const [CurrentData, setCurrentData] = useState();
  const [CurrentElement, setCurrentElement] = useState({});
  const [QuantityAsked, setQuantityAsked] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setCurrentElement({});
    setQuantityAsked(0);
  };
  const handleShow = (element) => {
    setShow(true);
    setCurrentElement(element);
  };

  useEffect(() => {
    setCurrentData(data);
    if (confirmation.message) {
      handleClose();
    }
  }, [data, confirmation]);

  const submitData = (e) => {
    e.preventDefault();
    let quantityAsked = document.getElementById("quantityAsked").value;
    console.log(quantityAsked);
    if (quantityAsked < 0 || quantityAsked === 0) {
      alert("Quantité demandée doit etre supérieur à 0!");
    } else {
      let cart = {
        quantityAsked: quantityAsked,
        item: CurrentElement.item,
        userId: user._id,
      };
      submitFct(cart);
    }
  };

  const getModalBody = () => {
    if (CurrentElement.item) {
      return (
        <Col lg={12}>
          <Row>
            <Col lg={6}>
              <Row>
                <Col lg={12} className="mb-4">
                  <h2 className="uppercase text-center font-semibold"> {CurrentElement.item.labels} </h2>
                </Col>
                <Col lg={12}>
                  <p>
                    {CurrentElement.item.level1} - {CurrentElement.item.level2}
                  </p>
                </Col>
                <Col lg={12}>
                  <p className="mt-4">Quantité actuelle : {numberWithCommas(CurrentElement.quantity)}</p>
                </Col>
                <Col lg={12}>
                  <p className="mt-4">Argent actuel : €{numberWithCommas(user.money)}</p>
                </Col>
              </Row>
            </Col>

            <Col lg={6}>
              <Row>
                <Col lg={12} className="mb-4">
                  <h2 className="uppercase text-center font-semibold"> {CurrentElement.item.labels} </h2>
                </Col>
                <Col lg={12}>
                  <p>
                    {CurrentElement.item.level1} - {CurrentElement.item.level2}
                  </p>
                </Col>
                <Col lg={12}>
                  <div className="mt-4">
                    <Form id="formReset" onSubmit={submitData}>
                      <Form.Group>
                        <Form.Label>Quantité désirée :</Form.Label>
                        <Form.Control
                          id="quantityAsked"
                          type="number"
                          onChange={() =>
                            setQuantityAsked(document.getElementById("quantityAsked").value < 0 ? 0 : document.getElementById("quantityAsked").value)
                          }
                          // isInvalid={props.errors.quantityAsked ? true : false}
                          placeholder="Entrer une valeur"
                          step={1}
                        ></Form.Control>
                      </Form.Group>
                      <Col lg="12">
                        <Button type="submit" variant="success" className="float-right">
                          <div className="inline-flex">
                            <Cart size={22} className="mr-2" /> <p>Ajouter au panier</p>
                          </div>
                        </Button>
                      </Col>
                    </Form>
                  </div>
                </Col>
                <Col lg={12}>
                  <p className="mt-4">Prix : €{numberWithCommas(QuantityAsked * CurrentElement.price)}</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      );
    } else {
      return null;
    }
  };

  if (user.role && data && CurrentData) {
    return (
      <>
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
                {CurrentData.map((element) => (
                  <tr key={element._id}>
                    <td style={{ maxWidth: "150px", textAlign: "center" }}>{element.item.labels}</td>
                    <td style={{ maxWidth: "150px", textAlign: "center" }}>{element.item.level1}</td>
                    <td style={{ maxWidth: "150px", textAlign: "center" }}>{element.item.level2}</td>
                    <td style={{ maxWidth: "75px", textAlign: "center" }}>{numberWithCommas(element.quantity)}</td>
                    <td style={{ maxWidth: "75px", textAlign: "center" }}>
                      <span className="font-semibold">{element.item.datePeremption}</span> jours
                    </td>
                    <td style={{ maxWidth: "75px", textAlign: "center" }}>
                      <span className="font-semibold">€ {numberWithCommas(element.price)}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Button variant="success" onClick={() => handleShow(element)}>
                        <i className="fas fa-truck"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Modal size="lg" centered show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title className="text-center">Commande</Modal.Title>
          </Modal.Header>
          <Modal.Body>{getModalBody()}</Modal.Body>
        </Modal>
      </>
    );
  } else {
    return (
      <Row>
        <Col lg="12">
          <p>Chargement...</p>
        </Col>
      </Row>
    );
  }
}

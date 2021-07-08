import React, { useEffect, useState } from "react";
import { Row, Col, Form, Modal, Table, Button, Card } from "react-bootstrap";
import { CupStraw } from "react-bootstrap-icons";
import { getBottomUp } from "./../../../common/requests/requests";

export default function ViewAllItems({ form, user, data, deleteFct, uniqueCategories, getOnlyCategories, submitConsome, confirmation }) {
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
      if (show) alert("Produit(s) consommé(s) avec succès!");
    }
  }, [data]);

  const getCategories = async () => {
    setCurrentData(await getOnlyCategories(document.getElementById("categories").value, data));
  };

  const submitData = (e) => {
    e.preventDefault();
    let quantityAsked = document.getElementById("quantityAsked").value;
    if (quantityAsked <= CurrentElement.quantity) {
      let item = {
        quantityUpdate: CurrentElement.quantity - quantityAsked,
        quantityAsked: quantityAsked,
        item: CurrentElement.item,
        userId: user._id,
        id: CurrentElement._id,
      };
      submitConsome(item, item.id);
    }
  };

  const onDelete = async (id, name) => {
    if (window.confirm(`Voulez vous jeter le produit: ${name} ?`)) {
      await deleteFct(id);
    }
  };

  const getModalBody = () => {
    if (CurrentElement.item) {
      return (
        <Col lg={12}>
          <Row className="justify-content-md-center">
            <Col lg={10}>
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
                  <p className="mt-4">Quantité actuelle : {CurrentElement.quantity}</p>
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
                          isInvalid={QuantityAsked > CurrentElement.quantity ? true : false}
                          placeholder="Entrer une valeur"
                          min={1}
                          step={1}
                        ></Form.Control>
                        <Form.Control.Feedback type="invalid">Veuillez vérifier la quantité</Form.Control.Feedback>
                      </Form.Group>
                      <Col lg="12">
                        <Button type="submit" variant="info" className="float-right">
                          <div className="inline-flex">
                            <CupStraw size={22} className="mr-2" /> <p>Consommer</p>
                          </div>
                        </Button>
                      </Col>
                    </Form>
                  </div>
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
      <Card className="homeCards">
        <Card.Header as="h4" className="blue-heading">
          {form.title}
        </Card.Header>
        <Card.Body>
          <Row>
            <Col lg={6}>
              <Form.Group onChange={() => getCategories()}>
                <Form.Label>Trier par catégorie :</Form.Label>
                <Form.Control as="select" id="categories">
                  <option>Tous</option>
                  {uniqueCategories.map((element, i) => (
                    <option key={i}>{element}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(user.role === "CLIENT" ? getBottomUp(CurrentData) : CurrentData).map((element) => (
                    <tr key={element._id}>
                      <td style={{ maxWidth: "150px", textAlign: "center" }}>{element.item.labels}</td>
                      <td style={{ maxWidth: "150px", textAlign: "center" }}>{element.item.level1}</td>
                      <td style={{ maxWidth: "150px", textAlign: "center" }}>{element.item.level2}</td>
                      <td style={{ maxWidth: "75px", textAlign: "center" }}>{element.quantity}</td>
                      <td style={{ maxWidth: "50px", textAlign: "center" }}>
                        <span className="font-semibold">{element.item.datePeremption}</span> jours
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {user.role === "CLIENT" ? (
                          <div>
                            <Button variant="success" className="mx-2" onClick={() => handleShow(element)}>
                              <i className="fas fa-utensils"></i>
                            </Button>
                            <Button variant="danger" className="mx-2" onClick={() => onDelete(element._id, element.item.labels)}>
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        ) : null}
                        {user.role === "MARKET" ? (
                          <div>
                            <Button variant="danger" className="mx-2" onClick={() => onDelete(element._id, element.item.labels)}>
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
          <Modal size="md" centered show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title className="text-center">Consommer</Modal.Title>
            </Modal.Header>
            <Modal.Body>{getModalBody()}</Modal.Body>
          </Modal>
        </Card.Body>
      </Card>
    );
  } else {
    return (
      <Card className="homeCards">
        <Card.Header as="h4" className="blue-heading">
          Inventaire
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

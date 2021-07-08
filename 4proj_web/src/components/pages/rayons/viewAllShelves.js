import React, { useEffect, useState } from "react";
import { Row, Col, Form, Modal, Button, Card } from "react-bootstrap";
import { ClipboardCheck, CartPlusFill, Cart4 } from "react-bootstrap-icons";
import OneShelve from "./oneShelve";

export default function ViewAllShelves({ user, data, submit, confirmation, initShelves }) {
  const [Shelves, setShelves] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  useEffect(() => {
    setShelves(data);
    if (confirmation) {
      handleClose();
      if (show) alert("Nouveau rayon créée avec succès!");
    }
  }, [data]);

  const submitData = (e) => {
    e.preventDefault();
    let newShelve = {
      name: document.getElementById("name").value,
      userId: user._id,
      items: [],
    };
    submit(newShelve);
  };

  const getModalBody = () => {
    return (
      <Col lg={12}>
        <Row className="justify-content-md-center">
          <Col lg={10}>
            <Row>
              <Col lg={12}>
                <div className="mt-4">
                  <Form id="formReset" onSubmit={submitData}>
                    <Form.Group>
                      <Form.Label>Nom :</Form.Label>
                      <Form.Control id="name" type="text" required placeholder="Entrer un nom de rayon"></Form.Control>
                    </Form.Group>
                    <Col lg="12">
                      <Button type="submit" variant="info" className="float-right">
                        <div className="inline-flex">
                          <ClipboardCheck size={22} className="mr-2" /> <p>Valider</p>
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
  };

  const initMyShelves = async () => {
    await initShelves();
  };

  const deleteShelve = async (id) => {
    console.log(id);
  };

  if (Shelves && Shelves.length >= 0) {
    return (
      <Card className="homeCards">
        <Card.Header as="h4" className="blue-heading">
          Mes rayons
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col lg={12} className="text-center">
              <div>
                <p className="mb-2">Besoin d'un nouveau rayon ?</p>
                <Button variant="info" className="inline-flex" onClick={() => handleShow()}>
                  <CartPlusFill size={24} className="mr-2" /> Créer un nouveau rayon
                </Button>
                <Modal size="md" centered show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title className="text-center">Nouveau rayon</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>{getModalBody()}</Modal.Body>
                </Modal>
              </div>
            </Col>
          </Row>
          {Shelves.length > 0 ? (
            <Row>
              {Shelves.map((element, i) => (
                <Col className="mb-3" lg="3" key={i}>
                  <OneShelve
                    deleteShelve={deleteShelve}
                    id={element._id}
                    title={element.name}
                    text={`Ce rayon a ${element.items.length} produit(s)`}
                    viewLink={`/home/shelves/${element._id}`}
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
                  <p className="">
                    Vous pouvez aussi initialiser les rayons automatiquement en appuyant sur le bouton ci dessous. Cela va organiser les différents
                    produits par catégorie.
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button variant="primary" className="mt-2 inline-flex" onClick={() => initMyShelves()}>
                    <Cart4 size={24} className="mr-2" />
                    Rayons par défaut
                  </Button>
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

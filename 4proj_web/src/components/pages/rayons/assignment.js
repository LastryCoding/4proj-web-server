import React, { useEffect, useState } from "react";
import { Row, Col, Form, Modal, Table, Button, Card } from "react-bootstrap";
import { ClipboardCheck, ClipboardPlus } from "react-bootstrap-icons";
import { getItemMarketNotInAnShelve, categoriesProduct, getShelveByName } from "./../../../common/requests/requests";

export default function Assignment({ shelves, inventory, getOnlyCategories, submitUpdate }) {
  const [CurrentData, setCurrentData] = useState([]);
  const [CurrentElement, setCurrentElement] = useState({});

  const [QuantityWanted, setQuantityWanted] = useState(false);
  const [UniqueCategories, setUniqueCategories] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setCurrentElement({});
    setQuantityWanted(0);
  };
  const handleShow = (element) => {
    setShow(true);
    setCurrentElement(element);
    setQuantityWanted(0);
  };

  const fetchData = async () => {
    let itemNotInAnyShelve = getItemMarketNotInAnShelve(shelves, inventory);
    setCurrentData(itemNotInAnyShelve);
    setUniqueCategories(await categoriesProduct(itemNotInAnyShelve));
  };

  useEffect(() => {
    fetchData();
    // if (confirmation) {
    //   handleClose();
    //   if (show) alert("Produit(s) consommé(s) avec succès!");
    // }
  }, [shelves, inventory]);

  const getCategories = async () => {
    setCurrentData(await getOnlyCategories(document.getElementById("categories").value, CurrentData));
  };

  const submitData = (e) => {
    e.preventDefault();
    if (CurrentElement._id && parseFloat(QuantityWanted) > 0) {
      let OneShelve = getShelveByName(shelves, document.getElementById("nameShelve").value);
      let newShelve = {
        userId: OneShelve.userId,
        name: OneShelve.name,
        item: CurrentElement,
        itemMarketId: CurrentElement._id,
      };
      newShelve.item.quantity = QuantityWanted;
      submitUpdate(newShelve, OneShelve._id);
    } else {
      alert("Veuillez choisir un produit et/ou une quantité valide");
    }
  };

  // const onDelete = async (id, name) => {
  //   if (window.confirm(`Voulez vous jeter le produit: ${name} ?`)) {
  //     await deleteFct(id);
  //   }
  // };

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
                      <Form.Label>Trier par nom :</Form.Label>
                      <Form.Control as="select" id="nameShelve">
                        <option>Veuillez faire un choix</option>
                        {shelves.map((element, i) => (
                          <option key={i}>{element.name}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <p className="mb-4">Quantité en inventaire : {CurrentElement.quantity ? CurrentElement.quantity : 0} </p>
                    <Form.Group>
                      <Form.Label>Quantité voulu :</Form.Label>
                      <Form.Control
                        id="quantityWanted"
                        type="number"
                        onChange={() =>
                          setQuantityWanted(document.getElementById("quantityWanted").value < 0 ? 0 : document.getElementById("quantityWanted").value)
                        }
                        isInvalid={QuantityWanted > CurrentElement.quantity ? true : false}
                        placeholder="Entrer une valeur"
                        min={1}
                        step={1}
                      ></Form.Control>
                      <Form.Control.Feedback type="invalid">Veuillez vérifier la quantité</Form.Control.Feedback>
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

  if (CurrentData) {
    return (
      <Card className="homeCards">
        <Card.Header as="h4" className="blue-heading">
          Affectation des produits aux rayons
        </Card.Header>
        <Card.Body>
          {CurrentData && CurrentData.length > 0 ? (
            <>
              <Row>
                <Col lg={6}>
                  <Form.Group onChange={() => getCategories()}>
                    <Form.Label>Trier par catégorie :</Form.Label>
                    <Form.Control as="select" id="categories">
                      <option>Tous</option>
                      {UniqueCategories.map((element, i) => (
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
                      {CurrentData.map((element) => (
                        <tr key={element._id}>
                          <td style={{ maxWidth: "150px", textAlign: "center" }}>{element.item.labels}</td>
                          <td style={{ maxWidth: "150px", textAlign: "center" }}>{element.item.level1}</td>
                          <td style={{ maxWidth: "150px", textAlign: "center" }}>{element.item.level2}</td>
                          <td style={{ maxWidth: "75px", textAlign: "center" }}>{element.quantity}</td>
                          <td style={{ maxWidth: "50px", textAlign: "center" }}>
                            <span className="font-semibold">{element.item.datePeremption}</span> jours
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <div>
                              <Button variant="info" className="mx-2" onClick={() => handleShow(element)}>
                                <ClipboardPlus size={22} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </>
          ) : (
            <p>Bien joué! Tous les produits sont affectés à au moins un rayon.</p>
          )}
        </Card.Body>
        <Modal size="md" centered show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title className="text-center">Consommer</Modal.Title>
          </Modal.Header>
          <Modal.Body>{getModalBody()}</Modal.Body>
        </Modal>
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

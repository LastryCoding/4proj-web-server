import React, { useEffect, useState } from "react";
import { Row, Col, Modal, Table, Button, Form, Card } from "react-bootstrap";
import { ClipboardPlus, ClipboardCheck, ClipboardMinus, PencilSquare, ClipboardX } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
import { read, numberWithCommas } from "./../../../common/requests/requests";
import { getItem } from "./../../../common/requests/requests";

export default function ViewOne({ urlApi, inventory, confirmation, submitUpdate, getOnlyCategories, uniqueCategories, submitDelete }) {
  const [OneShelve, setOneShelve] = useState({});
  const [MyInventory, setMyInventory] = useState({});
  const [Item, setItem] = useState({});
  const [CurrentData, setCurrentData] = useState([]);
  const [QuantityWanted, setQuantityWanted] = useState(0);
  
  const [ItemToDelete, setItemToDelete] = useState({});
  const [QuantityDelete, setQuantityDelete] = useState(0);
  
  const { id } = useParams();
  const getOneShelve = async (id) => {
    const shelveResult = await read(`${urlApi.shelves}/${id}`);
    if (shelveResult.status === 200) {
      setOneShelve(shelveResult.message);
    } else {
      setOneShelve({});
    }
  };
  useEffect(() => {
    getOneShelve(id);
    setMyInventory(inventory);
    if (confirmation) {
      setItem({});
      setCurrentData([]);
      handleClose();
      handleCloseDelete();
      handleCloseUpdate();
      if (show) alert("Nouveau produit ajouté au rayon avec succès!");
      if (showDelete) alert("Produit retiré du rayon avec succès!");
      if (showUpdate) alert("Rayon renommé avec succès!");
    }
  }, [urlApi, inventory]);

  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const handleClose = () => {
    setShow(false);
    setQuantityWanted(0);
  };
  const handleShow = () => {
    setShow(true);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
    setItemToDelete({});
    setQuantityDelete(0);
  };
  const handleShowDelete = (item) => {
    setItemToDelete(item);
    setShowDelete(true);
  };

  const handleCloseUpdate = () => {
    setShowUpdate(false);
  };
  const handleShowUpdate = () => {
    setShowUpdate(true);
  };

  const getCategories = async () => {
    if (document.getElementById("categories").value === "Veuillez faire un choix") {
      setCurrentData([]);
      setItem({});
    } else {
      setCurrentData(await getOnlyCategories(document.getElementById("categories").value, MyInventory));
      document.getElementById("item").value = "Veuillez faire un choix";
      document.getElementById("quantityWanted").value = 0;
      setItem({});
      setQuantityWanted(0);
    }
  };

  const getTheItem = async () => {
    if (document.getElementById("item") === "Veuillez faire un choix") {
      setItem({});
    } else {
      setItem(await getItem(document.getElementById("item").value, MyInventory));
      document.getElementById("quantityWanted").value = 0;
      setQuantityWanted(0);
    }
  };

  const submitData = async (e) => {
    e.preventDefault();
    if (Item._id && parseFloat(QuantityWanted) > 0) {
      let newItem = {
        ...Item,
      };
      newItem.quantity = parseFloat(QuantityWanted);
      let newShelve = {
        userId: OneShelve.userId,
        name: OneShelve.name,
        item: newItem,
        itemMarketId: Item._id,
      };
      await submitUpdate(newShelve, OneShelve._id);
    } else {
      alert("Veuillez choisir un produit et/ou une quantité valide");
    }
  };

  const submitDataDelete = async (e) => {
    e.preventDefault();
    if (ItemToDelete._id && parseFloat(QuantityDelete) > 0) {
      let newItem = {
        ...ItemToDelete,
      };
      newItem.quantity = -parseFloat(QuantityDelete);
      let newShelve = {
        userId: OneShelve.userId,
        name: OneShelve.name,
        item: newItem,
        itemMarketId: ItemToDelete._id,
      };
      await submitUpdate(newShelve, OneShelve._id);
    } else {
      alert("Veuillez choisir une quantité valide");
    }
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
                    <Form.Group onChange={() => getCategories()}>
                      <Form.Label>Trier par catégorie :</Form.Label>
                      <Form.Control as="select" id="categories">
                        <option>Veuillez faire un choix</option>
                        {uniqueCategories.map((element, i) => (
                          <option key={i}>{element}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group onChange={() => getTheItem()}>
                      <Form.Label>Trier par nom :</Form.Label>
                      <Form.Control as="select" id="item">
                        <option>Veuillez faire un choix</option>
                        {CurrentData.map((element, i) => (
                          <option key={i}>{element.item.labels}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <p className="mb-4">Quantité en inventaire : {Item.quantity ? Item.quantity : 0} </p>
                    <Form.Group>
                      <Form.Label>Quantité voulu :</Form.Label>
                      <Form.Control
                        id="quantityWanted"
                        type="number"
                        onChange={() =>
                          setQuantityWanted(document.getElementById("quantityWanted").value < 0 ? 0 : document.getElementById("quantityWanted").value)
                        }
                        isInvalid={QuantityWanted > Item.quantity ? true : false}
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

  const toggleCheck = async () => {
    let newShelve = {
      userId: OneShelve.userId,
      name: OneShelve.name,
      sensor: !OneShelve.sensor,
    };
    await submitUpdate(newShelve, OneShelve._id);
  };

  const submitDataUpdate = async (e) => {
    e.preventDefault();
    let newShelve = {
      userId: OneShelve.userId,
      name: document.getElementById("newName").value,
    };
    await submitUpdate(newShelve, OneShelve._id);
  };
  const getModalBodyDelete = () => {
    return (
      <Col lg={12}>
        <Row className="justify-content-md-center">
          <Col lg={10}>
            <Row>
              <Col lg={12}>
                <div className="mt-4">
                  <Form id="formReset" onSubmit={submitDataDelete}>
                    <p>Catégorie : {ItemToDelete.item && ItemToDelete.item.level1}</p>
                    <p>Nom : {ItemToDelete.item && ItemToDelete.item.labels}</p>
                    <p className="mb-4">Quantité en rayon : {ItemToDelete.quantity ? ItemToDelete.quantity : 0} </p>
                    <Form.Group>
                      <Form.Label>Quantité à retirer :</Form.Label>
                      <Form.Control
                        id="quantityDelete"
                        type="number"
                        onChange={() =>
                          setQuantityDelete(document.getElementById("quantityDelete").value < 0 ? 0 : document.getElementById("quantityDelete").value)
                        }
                        isInvalid={QuantityDelete > ItemToDelete.quantity ? true : false}
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

  const getModalBodyUpdate = () => {
    return (
      <Col lg={12}>
        <Row className="justify-content-md-center">
          <Col lg={10}>
            <Row>
              <Col lg={12}>
                <div className="mt-4">
                  <Form id="formReset" onSubmit={submitDataUpdate}>
                    <p className="mb-4">
                      Nom du rayon : <span className="font-semibold">{OneShelve.name ? OneShelve.name : "Chargement"}</span>{" "}
                    </p>
                    <Form.Group>
                      <Form.Label>Nouveau nom :</Form.Label>
                      <Form.Control id="newName" type="text" placeholder="Entrer un nouveau nom" required></Form.Control>
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

  const handleDeleteShelve = async () => {
    if (window.confirm(`Voulez vous vraiment supprimer le rayon: ${OneShelve.name} ? Tous les produits reviendront en inventaire!`)) {
      await submitDelete(OneShelve._id);
    }
  };

  return (
    <Card className="homeCards">
      <Card.Header as="h4" className="blue-heading">
        Mon rayon
      </Card.Header>

      <Card.Body>
        <Row>
          <Col lg="12">
            <Row className="mb-4">
              <Col lg="6">
                <p className="text-2xl text-center">
                  Nom du rayon : <span className="font-semibold">{OneShelve.name}</span>
                </p>
              </Col>
              <Col lg="6">
                <p className="text-2xl text-center">Nombre total d'article : {OneShelve.items && OneShelve.items.length}</p>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col lg="6">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button variant="success" className="inline-flex mx-auto" onClick={() => handleShow()}>
                    <ClipboardPlus size={22} className="mr-2" /> <p>Rajouter un produit</p>
                  </Button>
                  <Button variant="primary" className="inline-flex mx-auto" onClick={() => handleShowUpdate()}>
                    <PencilSquare size={22} className="mr-2" /> <p>Editer le rayon</p>
                  </Button>
                </div>
              </Col>
              <Col lg="6">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Form.Check type="switch" label="Rajouter un capteur" id="sensorSwitch" checked={OneShelve.sensor} onClick={() => toggleCheck()} />
                  <Button variant="danger" className="inline-flex mx-auto" onClick={() => handleDeleteShelve()}>
                    <ClipboardX size={22} className="mr-2" /> <p>Supprimer le rayon</p>
                  </Button>
                </div>
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
                      <th>Date de péremption</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OneShelve.items &&
                      OneShelve.items.map((element) =>
                        OneShelve.sensor ? (
                          element.quantity < 20 || element.item.datePeremption < 2 ? (
                            <tr key={element._id} style={{ backgroundColor: "#F77154" }}>
                              <td style={{ maxWidth: "120px", textAlign: "center" }}>{element.item.labels}</td>
                              <td style={{ maxWidth: "120px", textAlign: "center" }}>{element.item.level1}</td>
                              <td style={{ maxWidth: "120px", textAlign: "center" }}>{element.item.level2}</td>
                              <td style={{ maxWidth: "75px", textAlign: "center" }}>{numberWithCommas(element.quantity)}</td>
                              <td style={{ maxWidth: "75px", textAlign: "center" }}>{element.item.datePeremption} jours</td>
                              <td style={{ maxWidth: "75px", textAlign: "center" }}>
                                <Button variant="danger" className="inline-flex" onClick={() => handleShowDelete(element)}>
                                  <ClipboardMinus size={22} />
                                </Button>
                              </td>
                            </tr>
                          ) : (
                            <tr key={element._id}>
                              <td style={{ maxWidth: "120px", textAlign: "center" }}>{element.item.labels}</td>
                              <td style={{ maxWidth: "120px", textAlign: "center" }}>{element.item.level1}</td>
                              <td style={{ maxWidth: "120px", textAlign: "center" }}>{element.item.level2}</td>
                              <td style={{ maxWidth: "75px", textAlign: "center" }}>{numberWithCommas(element.quantity)}</td>
                              <td style={{ maxWidth: "75px", textAlign: "center" }}>{element.item.datePeremption} jours</td>
                              <td style={{ maxWidth: "75px", textAlign: "center" }}>
                                <Button variant="danger" className="inline-flex" onClick={() => handleShowDelete(element)}>
                                  <ClipboardMinus size={22} />
                                </Button>
                              </td>
                            </tr>
                          )
                        ) : (
                          <tr key={element._id}>
                            <td style={{ maxWidth: "120px", textAlign: "center" }}>{element.item.labels}</td>
                            <td style={{ maxWidth: "120px", textAlign: "center" }}>{element.item.level1}</td>
                            <td style={{ maxWidth: "120px", textAlign: "center" }}>{element.item.level2}</td>
                            <td style={{ maxWidth: "75px", textAlign: "center" }}>{numberWithCommas(element.quantity)}</td>
                            <td style={{ maxWidth: "75px", textAlign: "center" }}>{element.item.datePeremption} jours</td>
                            <td style={{ maxWidth: "75px", textAlign: "center" }}>
                              <Button variant="danger" className="inline-flex" onClick={() => handleShowDelete(element)}>
                                <ClipboardMinus size={22} />
                              </Button>
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Col>
        </Row>
        <Modal size="md" centered show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title className="text-center">Choix du produit</Modal.Title>
          </Modal.Header>
          <Modal.Body>{getModalBody()}</Modal.Body>
        </Modal>
        <Modal size="md" centered show={showDelete} onHide={handleCloseDelete}>
          <Modal.Header closeButton>
            <Modal.Title className="text-center">Retrait de produit du rayon</Modal.Title>
          </Modal.Header>
          <Modal.Body>{getModalBodyDelete()}</Modal.Body>
        </Modal>
        <Modal size="md" centered show={showUpdate} onHide={handleCloseUpdate}>
          <Modal.Header closeButton>
            <Modal.Title className="text-center">Changement du nom du rayon</Modal.Title>
          </Modal.Header>
          <Modal.Body>{getModalBodyUpdate()}</Modal.Body>
        </Modal>
      </Card.Body>
    </Card>
  );
}

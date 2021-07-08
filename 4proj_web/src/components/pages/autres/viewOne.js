import React, { useEffect, useState } from "react";
import { Row, Col, Table, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { read, numberWithCommas } from "./../../../common/requests/requests";
export default function ViewOne({ urlApi }) {
  const [OneTransaction, setOneTransaction] = useState({});

  const { id } = useParams();
  const getOneTransaction = async (id) => {
    const transactionResult = await read(`${urlApi.myTransactionsAPI}/${id}`);
    if (transactionResult.status === 200) {
      setOneTransaction(transactionResult.message);
    } else {
      setOneTransaction({});
    }
  };
  useEffect(() => {
    getOneTransaction(id);
  }, [urlApi]);
  return (
    <Card className="homeCards">
      <Card.Header as="h4" className="blue-heading">
        Ma transaction
      </Card.Header>

      <Card.Body>
        <Row>
          <Col lg="12">
            <Row className="mb-4">
              <Col lg="4">
                <p className="font-semibold text-2xl">ID Transaction : {OneTransaction._id}</p>
              </Col>
              <Col lg="4">
                <p className="font-semibold text-2xl">Nombre total d'article : {OneTransaction.items && OneTransaction.items.length}</p>
              </Col>
              <Col lg="4">
                <p className="font-semibold text-2xl">Prix total : € {numberWithCommas(OneTransaction.price ? OneTransaction.price : 0)}</p>
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
                      <th>Prix</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OneTransaction.items &&
                      OneTransaction.items.map((element) => (
                        <tr key={element._id}>
                          <td style={{ maxWidth: "350px", textAlign: "center" }}>{element.item.labels}</td>
                          <td style={{ maxWidth: "350px", textAlign: "center" }}>{element.item.level1}</td>
                          <td style={{ maxWidth: "350px", textAlign: "center" }}>{element.item.level2}</td>
                          <td style={{ maxWidth: "350px", textAlign: "center" }}>{numberWithCommas(element.quantity)}</td>
                          <td style={{ maxWidth: "350px", textAlign: "center" }}>€ {numberWithCommas(element.price * element.quantity)}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

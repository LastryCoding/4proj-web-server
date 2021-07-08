import React from "react";
import { Row, Col, Table, Button, Card } from "react-bootstrap";
import { EyeFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { getBottomUp } from "./../../../common/requests/requests";

export default function ViewAllTransactions({ data }) {
  return (
    <Card className="homeCards">
      <Card.Header as="h4" className="blue-heading">
        Liste de toutes les transactions
      </Card.Header>

      <Card.Body>
        <Row>
          <Col lg="12">
            <Table striped bordered hover responsive>
              <thead style={{ textAlign: "center" }}>
                <tr>
                  <th>Transaction ID</th>
                  <th>Nombre d'article</th>
                  <th>Prix total</th>
                  {/* <th>Date de péremption</th> */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* {getBottomUp(data)} */}
                {getBottomUp(data).map((element) => (
                  <tr key={element._id}>
                    <td>{element._id}</td>
                    <td style={{ maxWidth: "350px" }}>{element.items.length}</td>
                    <td style={{ maxWidth: "350px" }}>€ {element.price}</td>
                    <td style={{ textAlign: "center" }}>
                      <Link
                        to={{
                          pathname: "/home/transactions/" + element._id,
                        }}
                      >
                        <Button variant="success">
                          <EyeFill size={20} className="my-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

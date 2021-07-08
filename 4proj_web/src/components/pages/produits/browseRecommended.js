import React, { useEffect, useState } from "react";
import { Row, Col, Table } from "react-bootstrap";

export default function Browse({ user, data }) {
  const [CurrentData, setCurrentData] = useState();
  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  if (user.role && data && CurrentData) {
    return (
      <Row>
        <Col lg="12">
          <Table striped bordered hover responsive>
            <thead style={{ textAlign: "center" }}>
              <tr>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {CurrentData.map((element) => (
                <tr key={element._id}>
                  <td style={{ maxWidth: "150px", textAlign: "center" }}>{element.item.labels}</td>
                  <td style={{ maxWidth: "150px", textAlign: "center" }}>{element.item.level1}</td>
                  <td style={{ maxWidth: "150px", textAlign: "center" }}>{element.item.level2}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
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

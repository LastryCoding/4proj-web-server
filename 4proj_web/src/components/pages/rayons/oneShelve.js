import React from "react";
import { Col, Card } from "react-bootstrap";
import { EyeFill, Clock, GraphDown } from "react-bootstrap-icons";

export default function ViewOneShelve({ title, text, viewLink, alertDate, alertQuantity, sensor, role }) {
  switch (role) {
    case "MARKET":
      return (
        <Card>
          {sensor ? (
            <>
              {alertQuantity ? (
                <div style={{ position: "absolute", top: "-5px", left: "0px", color: "#ffffff", backgroundColor: "#DA3F1D", borderRadius: "8px" }}>
                  <GraphDown size={24} />
                </div>
              ) : null}
              {alertDate ? (
                <div style={{ position: "absolute", top: "-5px", right: "0px", color: "#ffffff", backgroundColor: "#DA3F1D", borderRadius: "4px" }}>
                  <Clock size={26} />
                </div>
              ) : null}
            </>
          ) : null}
          <Card.Body>
            <Card.Title>{title}</Card.Title>
            <Card.Text>{text}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <Col lg={12}>
              <Card.Link href={viewLink}>
                <EyeFill size={28} color="green" className="mx-auto" />
              </Card.Link>
            </Col>
          </Card.Footer>
        </Card>
      );

    default:
      return (
        <Card>
          <Card.Body>
            <Card.Title>{title}</Card.Title>
            <Card.Text>{text}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <Col lg={12}>
              <Card.Link href={viewLink}>
                <EyeFill size={28} color="green" className="mx-auto" />
              </Card.Link>
            </Col>
          </Card.Footer>
        </Card>
      );
  }
}

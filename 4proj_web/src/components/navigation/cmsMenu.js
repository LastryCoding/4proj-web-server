import React from "react";
import { Accordion, Card, Button, Row, Col } from "react-bootstrap";

export default function Menu({ menu, user }) {
  if (user.role) {
    return (
      <Accordion>
        {menu[user.role.toLowerCase()].map((element, i) => (
          <Card key={i} className="border-0">
            <Card.Header className="p-0 border-0"></Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey={i + 1}>
              <i className="fas fa-angle-right"></i> {element.title}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={i + 1}>
              <Card.Body className="p-0 cmsMenuBody">
                <ul style={{ listStyle: "none", paddingLeft: "10px" }}>
                  {element.links.map((link, j) => (
                    <li key={j}>
                      <a href={link.url}>
                        <i className="fas fa-angle-double-right"></i> {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
    );
  } else {
    return (
      <Row>
        <Col lg={12}>
          <div className="text-center">Chargement...</div>
        </Col>
      </Row>
    );
  }
}

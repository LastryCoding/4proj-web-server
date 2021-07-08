import React from "react";
import { Row, Col, Button, Tabs, Tab, Card } from "react-bootstrap";
import { getBottomUp } from "./../../../common/requests/requests";

export default function ViewNotifications({ data, submitNotifUpdate, submitNotifDelete }) {
  const submitNotif = (element) => {
    let elementUpdated = {
      ...element,
    };
    elementUpdated.status = "ARCHIVE";
    submitNotifUpdate(elementUpdated, elementUpdated._id);
  };
  const submitDelete = (element) => {
    submitNotifDelete(element._id);
  };

  return (
    <Card className="homeCards">
      <Card.Header as="h4" className="blue-heading">
        Mes notifications
      </Card.Header>

      <Card.Body>
        <Row>
          <Col lg="12">
            <Tabs defaultActiveKey="ActiveNotif" id="azerty">
              <Tab eventKey="ActiveNotif" title="Notifications récentes">
                <Row>
                  <Col lg={10} className="mx-auto">
                    {getBottomUp(data).map((element, i) =>
                      element.status !== "ACTIVE" ? null : (
                        <Row key={i} className="justify-content-md-center">
                          <Col lg={10} className="py-4 pl-4 shadow-xl rounded-lg">
                            <p className="font-semibold pt-2"> {element.msg} </p>
                            <Button variant="success" className="float-right" onClick={() => submitNotif(element)}>
                              Lu
                            </Button>
                          </Col>
                        </Row>
                      )
                    )}
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey="archivedNotifs" title="Notifications archivées ">
                {getBottomUp(data).map((element, i) =>
                  element.status !== "ARCHIVE" ? null : (
                    <Row key={i} className="justify-content-md-center">
                      <Col lg={10} className="py-4 pl-4 shadow-xl rounded-lg">
                        <p className="font-semibold pt-2"> {element.msg} </p>
                        <Button variant="danger" className="float-right" onClick={() => submitDelete(element)}>
                          Supprimer
                        </Button>
                      </Col>
                    </Row>
                  )
                )}
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

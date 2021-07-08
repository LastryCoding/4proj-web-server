import React from "react";
import { Row, Col, Badge, Button } from "react-bootstrap";
import { CashStack } from "react-bootstrap-icons";
import { clearLocalStorage, numberWithCommas } from "../../common/requests/requests";
import CMSMenu from "./cmsMenu";

export default function SideNav({ menu, user, notif }) {
  const logMeOut = async (event) => {
    event.preventDefault();
    await clearLocalStorage();
    window.location.href = "/";
  };

  const getActiveNotif = () => {
    let activeNotif = [];
    for (let i = 0; i < notif.length; i++) {
      const currentNotif = notif[i];
      if (currentNotif.status === "ACTIVE") {
        activeNotif.push(currentNotif);
      }
    }
    return activeNotif.length;
  };

  return (
    <div>
      <Row>
        <div id="adminProfilePicture" className="mt-2" style={{ backgroundImage: `url('/${user.role.toLowerCase()}.png')` }}></div>
      </Row>
      <Row>
        <Col lg="12" style={{ textAlign: "center" }}>
          <h6 className="blue-heading uppercase">
            {user.fullName} <Badge variant="info">{user.role}</Badge>
          </h6>
          <div className="inline-flex my-3">
            <CashStack size={28} className="mr-2" color="green" />{" "}
            <span className="font-semibold"> ${numberWithCommas(user.money ? user.money : 0)} </span>
          </div>
          <hr />
        </Col>
      </Row>
      <Row className="m-0">
        <Col lg="12" className="p-0">
          <ul id="sideNavMenu">
            <a className="sideNavMenuLink" href="/home/profil">
              <li className="sideNavMenuItem">
                <i className="fas fa-user"></i> Profil
              </li>
            </a>
            <a className="sideNavMenuLink" href="/home/notifications">
              <li className="sideNavMenuItem">
                {notif && getActiveNotif() > 0 ? (
                  <div className="inline-flex">
                    <i className="fas fa-bell mr-2 text-red-500"></i> <p>Notifications {getActiveNotif()} </p>
                  </div>
                ) : (
                  <div className="inline-flex">
                    <i className="fas fa-bell mr-2"></i> <p>Notifications</p>
                  </div>
                )}
              </li>
            </a>
          </ul>
        </Col>
        <Col lg="12" className="p-0">
          <hr />
          <CMSMenu menu={menu} user={user} />
          <hr />
        </Col>
        <Col lg="12" className="p-0 mt-3">
          <Button variant="danger" onClick={(event) => logMeOut(event)}>
            <i className="fas fa-power-off"></i> Log Out
          </Button>
        </Col>
      </Row>
    </div>
  );
}

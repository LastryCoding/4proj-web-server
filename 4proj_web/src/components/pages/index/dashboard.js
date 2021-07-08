import React from "react";
import { Row, Col } from "react-bootstrap";
import VerticalBar from "./verticalBar";
import LineChart from "./lineChart";

export default function Dashboard() {
  return (
    // <Row>
    //   <Col lg={12}>
    //     <div className="flex flex-wrap">
    //       <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
    //         <VerticalBar />
    //       </div>
    //       <div className="w-full xl:w-4/12 px-4">
    //         <LineChart />
    //       </div>
    //     </div>
    //   </Col>
    //   <Col lg={12}>test</Col>
    // </Row>
    <Row>
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <VerticalBar />
      </div>
      <div className="w-full xl:w-4/12 px-4">
        <LineChart />
      </div>
    </Row>
  );
}

import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { read, getOnlyRecommendedProductsFromData } from "./../../../common/requests/requests";
import BrowseRecommended from "./browseRecommended";

export default function Recommendation({ urlApi, user, data }) {
  const [RecommendedProducts, setRecommendedProducts] = useState([]);
  const getRecommendedProducts = async () => {
    const recommendationResult = await read(urlApi.recosys);
    if (recommendationResult.status === 200) {
      setRecommendedProducts(await getOnlyRecommendedProductsFromData(data, recommendationResult.message));
    } else {
      setRecommendedProducts([]);
    }
  };
  useEffect(() => {
    getRecommendedProducts();
  }, [urlApi, data]);

  if (RecommendedProducts.length > 0) {
    return (
      <Card className="homeCards mt-4">
        <Card.Header as="h4" className="blue-heading">
          Recommendation :
        </Card.Header>
        <Card.Body>
          <Row>
            <Col lg="12">
              <Row className="mb-4">
                <Col lg={12}>
                  <h2>Selon votre panier, vous aimeriez aussi: </h2>
                </Col>
              </Row>
              <Row>
                <Col lg="12">
                  <BrowseRecommended user={user} data={RecommendedProducts} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  } else {
    return null;
  }
}

import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { read, getOnlyRecommendedProductsFromData } from "./../../../common/requests/requests";
import BrowseRecommendedWithBuy from "./browseRecoWithBuy";

export default function Recommendation({ urlApi, user, data, submitFct, confirmation }) {
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
  console.log(RecommendedProducts);

  if (RecommendedProducts.length > 0) {
    return (
      <Card className="homeCards mt-4">
        <Card.Body>
          <Row>
            <Col lg="12">
              <Row className="mb-4">
                <Col lg={12}>
                  <h2>Vous aimeriez aussi: </h2>
                </Col>
              </Row>
              <Row>
                <Col lg="12">
                  <BrowseRecommendedWithBuy user={user} data={RecommendedProducts} submitFct={submitFct} confirmation={confirmation} />
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

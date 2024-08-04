import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const Certificate = () => {
  return (
    <div style={{ backgroundColor: 'black', color: 'white', padding: '30px', border: '20px solid black', fontSize: '24px' }}>
      <Container>
        <Row>
          <Col>
            <h1 style={{ textAlign: 'center', fontSize: '66px' }}>Get Certificate NFT</h1>
          </Col>
        </Row>
        <Row>
          <Col xs="6" style={{ textAlign: 'right' }}>
            <img
              src={process.env.PUBLIC_URL + "/DecodeDataCertificate.png"}
              alt="got badge"
              style={{ width: "520px", height: "360px" }}
            />
          </Col>
          <Col xs="6" style={{ textAlign: 'left' }}>
            <img
              src={process.env.PUBLIC_URL + "/DecodeDataCertificate.png"}
              alt="got badge"
              style={{ width: "520px", height: "360px" }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Certificate;

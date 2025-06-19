import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import CountUp from "react-countup";

const SalesCard = ({ title, value, subtitle, link = 'Total' }) => (
  <Card className="card-block card-stretch card-height">
    <Card.Body>
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <span className="text-dark">{title}</span>
      </div>
      <h4 className="counter">₹<CountUp start={0} end={value} duration={3} useEasing separator="," /></h4>
      {subtitle && <small>{subtitle}</small>}
    </Card.Body>
  </Card>
);

const GraphAndCardsLayout = (props) => {
  const { graphTitle, graphValue, chartOptions, chartSeries, cards1, cards2 } = props;
  return (
    <Row>
      <Col lg="3" md="6">
        <Card className="card-block card-stretch card-height">
          <Card.Body>
            <div className="mb-3">
              <h2 className="counter">₹<CountUp start={0} end={graphValue} duration={3} useEasing={true} separator="," />
              </h2>
            </div>
            <div>
              <Chart options={chartOptions} series={chartSeries} type="bar" height="100%" />
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg="9" md="6">
        <Row >
          {cards1?.map((data, index) => (
            <Col lg="2" md="6" key={index}>
              <SalesCard
                title={data.title}
                value={data.value}
                subtitle={data.note}
              />
            </Col>
          ))}
        </Row>
        <Row >
          {cards2?.map((data, index) => (
            <Col lg="3" md="6" key={index}>
              <SalesCard
                title={data.title}
                value={data.value}
                subtitle={data.note}
              />
              <p>{data?.amount}</p>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
}

export default GraphAndCardsLayout;

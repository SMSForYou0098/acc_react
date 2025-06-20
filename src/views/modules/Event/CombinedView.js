import React from 'react';
import { Row, Col, Card, CardBody, CardHeader } from 'react-bootstrap';
import Category from './Category/Category';
import Zone from './Zone/Zone';

const CombinedView = () => {
    return (
        <Row>
            <Col md="6">
                <Category />
            </Col>
            <Col md="6">
                <Zone />
            </Col>
        </Row>
    );
};

export default CombinedView;
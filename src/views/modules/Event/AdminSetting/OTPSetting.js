import React from 'react'
import { Card, Col, Row, Form } from 'react-bootstrap'

const OtpSetting = () => {
    return (
        <Row>
            <Col lg="8">
                <Card>
                    <Card.Header>
                        <h4 className="card-title">Admin Settings</h4>
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <Row>
                                <Col lg="6">
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label>Logo</Form.Label>
                                        <Form.Control type="file" id="customFile" />
                                    </Form.Group>
                                </Col>
                                <Col lg="6">
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label>Favicon</Form.Label>
                                        <Form.Control type="file" id="customFile" />
                                    </Form.Group>
                                </Col>
                                <Col lg="6">
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label className="custom-file-input">App Name</Form.Label>
                                        <Form.Control type="text" placeholder="Last name" />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default OtpSetting
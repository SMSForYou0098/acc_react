import React from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
const PayPal = () => {
    return (
        <Form>
            <Row>
                <Col lg="6">
                    <Form.Group className="mb-3 form-group">
                        <Form.Label className="custom-file-input">PayPal Client ID</Form.Label>
                        <Form.Control type="text" placeholder="" />
                    </Form.Group>
                </Col>
                <Col lg="6">
                    <Form.Group className="mb-3 form-group">
                        <Form.Label className="custom-file-input">PayPal Secret</Form.Label>
                        <Form.Control type="text" placeholder="" />
                    </Form.Group>
                </Col>
                <Col lg="6">
                    <Form.Label className="custom-file-input">Status</Form.Label>
                    <Row>
                        <Col lg="6" className='d-flex gap-3'>
                            <div className="form-radio form-check">
                                <Form.Check.Input
                                    type="radio"
                                    id="customRadio8"
                                    name="payment"
                                    className="me-2"
                                    value={'SSL'}
                                // onChange={(e)=>setMethod(e.target.value)}
                                />
                                <Form.Label
                                    className="custom-control-label"
                                    htmlFor="customRadio8"
                                >
                                    {" "}
                                    Enable
                                </Form.Label>
                            </div>
                            <div className="form-radio form-check">
                                <Form.Check.Input
                                    type="radio"
                                    id="customRadio8"
                                    name="payment"
                                    className="me-2"
                                    value={'TSL'}
                                // onChange={(e)=>setMethod(e.target.value)}
                                />
                                <Form.Label
                                    className="custom-control-label"
                                    htmlFor="customRadio8"
                                >
                                    {" "}
                                    Disable
                                </Form.Label>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <div className='d-flex justify-content-end'>
                    <Button type="button" className=""
                    // onClick={() => handleSubmit()}
                    >Submit</Button>
                </div>
            </Row>
        </Form>
    )
}

export default PayPal
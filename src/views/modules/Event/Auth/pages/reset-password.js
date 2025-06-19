import React, { memo, Fragment } from 'react'

// React-bootstrap
import { Row, Col, Form, Button, Card } from 'react-bootstrap'


//Components
import { useNavigate } from 'react-router-dom'
import Autheffect from '../components/auth-effect'

const Resetpassword = memo(() => {
    let history = useNavigate()
    return (
        <Fragment>
            <div className="iq-auth-page">
                <Autheffect />
                <Row className="align-items-center iq-auth-container w-100">
                    <Col lg="4" className="col-10 offset-lg-7 offset-1">
                        <Card>
                            <Card.Body>
                                <h4>Reset Password</h4>
                                <p>Enter your email address and we’ll send you an email with instructions to reset your password</p>
                                <div className="form-group me-3">
                                    <Form.Label >Email</Form.Label>
                                    <Form.Control type="email" className="mb-0" placeholder="Enter Email" />
                                </div>
                                <Button onClick={() => history('/dashboard')}>Reset</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Fragment>
    )
})

Resetpassword.displayName = "Resetpassword"
export default Resetpassword

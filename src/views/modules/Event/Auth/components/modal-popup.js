import  React,{memo,Fragment} from 'react'

//react-bootstrap
import { Row, Col, Form, Image, Button, Modal } from 'react-bootstrap'

//router
import { Link } from 'react-router-dom'

//img
import img1 from '../../../../../assets/images/brands/fb.svg'
import img2 from '../../../../../assets/images/brands/gm.svg'
import img3 from '../../../../../assets/images/brands/im.svg'
import img4 from '../../../../../assets/images/brands/li.svg'

const Modalpopup = memo( (props) => {
  return (
        <Fragment>
            {props.sign === 'in' &&
                <Modal show={props.show} onHide={props.handleclose} backdrop="static" centered>
                    <Modal.Body>
                        <h3 className="text-center">Sign In</h3>
                        <p className="text-center">Sign in to stay connected</p>
                        <div className="form-group">
                            <Form.Label  htmlFor="email-id">Email address</Form.Label>
                            <input type="email" className="form-control mb-0" id="email-id" placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <Form.Label  htmlFor="password">Password</Form.Label>
                            <input type="password" className="form-control mb-0" id="password" placeholder="Enter password" />
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <Form.Check className="form-check d-inline-block pt-1 mb-0">
                                <input type="checkbox" className="form-check-input" id="customCheck11" />
                                <Form.Label className="form-check-label" htmlFor="customCheck11">Remember Me</Form.Label>
                            </Form.Check>
                                <Link to="/auth/reset-password">Forget password</Link>
                        </div>
                        <div className="text-center pb-3">
                            <Button type="button" className="primary" onClick={props.handleclose}>Sign in</Button>
                        </div>
                        <p className="text-center">Or sign in with other accounts?</p>
                        <div className="d-flex justify-content-center">
                            <ul className="list-group list-group-horizontal list-group-flush">
                            <li className="list-group-item border-0 pb-0">
                                <Link to="#"><Image src={img1} alt="fb" loading="lazy" /></Link>
                            </li>
                            <li className="list-group-item border-0 pb-0">
                                <Link to="#"><Image src={img2} alt="gm" loading="lazy" /></Link>
                            </li>
                            <li className="list-group-item border-0 pb-0">
                                <Link to="#"><Image src={img3} alt="im" loading="lazy" /></Link>
                            </li>
                            <li className="list-group-item border-0 pb-0">
                                <Link to="#"><Image src={img4} alt="li" loading="lazy" /></Link>
                            </li>
                            </ul>
                        </div>
                        <p className="text-center">Don't have account?<Link to="#" className="ms-2"> Click here to sign up.</Link></p>
                    </Modal.Body>
                </Modal>
            }
            {props.sign === 'up' &&
                <Modal show={props.show} onHide={props.handleclose} backdrop="static" centered>
                    <Modal.Body>
                        <div className="mb-3">
                            <h3 className="text-center">Sign Up</h3>
                            <p className="text-center">Create your Get Your Ticket account</p>
                        </div>
                        <Row className="d-flex justify-content-between">
                            <Col sm="12" md="6" className="form-group">
                                <Form.Label className="form-label" htmlFor="firstName">First Name</Form.Label>
                                <input type="email" className="form-control mb-0" id="firstName" placeholder="Enter First Name" />
                            </Col>
                            <Col sm="12" md="6" className="form-group">
                                <Form.Label className="form-label" htmlFor="lastname">Last Name</Form.Label>
                                <input type="password" className="form-control mb-0" id="lastname" placeholder="Enter Last Name" />
                            </Col>
                        </Row>
                        <Row className="d-flex justify-content-between">
                            <Col sm="12" md="6" className="form-group">
                                <Form.Label className="form-label" htmlFor="Emailid">Email</Form.Label>
                                <input type="email" className="form-control mb-0" id="Emailid"  placeholder="Enter Email" />
                            </Col>
                            <div className="form-group col-sm-12 col-md-6">
                                <Form.Label className="form-label" htmlFor="Phone_NO">Phone No.</Form.Label>
                                <input type="password" className="form-control mb-0" id="Phone_NO" placeholder="Enter Phone Number" />
                            </div>
                        </Row>
                        <Row className="d-flex justify-content-between">
                            <Col sm="12" md="6" className="form-group">
                                <Form.Label className="form-label" htmlFor ="firstPassword">Password</Form.Label>
                                <input type="email" className="form-control mb-0" id="firstPassword"  placeholder="Enter Password" />
                            </Col>
                            <Col sm="12" md="6" className="form-group">
                                <Form.Label className="form-label" htmlFor="ConfirmPAssword">Confirm Password</Form.Label>
                                <input type="password" className="form-control mb-0" id="ConfirmPAssword" placeholder="Enter Confirm Password" />
                            </Col>
                        </Row>
                        <div className="text-center pb-3">
                            <input type="checkbox" className="form-check-input" id="aggrement-hopeui" />
                            <Form.Label className="form-check-label ms-1" htmlFor="aggrement-hopeui">I agree with the terms of use</Form.Label>
                        </div>
                        <div className="text-center pb-3">
                            <Button type="button" className="btn btn-primary" onClick={props.handleclose}>Sign Up</Button>
                        </div>
                        <p className="text-center">Or sign in with other accounts?</p>
                        <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
                            <Link to="#"><Image src={img1} alt="fb" loading="lazy" /></Link>
                            <Link to="#"><Image src={img2} alt="gm" loading="lazy" /></Link>
                            <Link to="#"><Image src={img3} alt="im" loading="lazy" /></Link>
                            <Link to="#"><Image src={img4} alt="li" loading="lazy" /></Link>
                        </div>
                        <p className="text-center">Already have an Account<Link to="#" className="ms-2">Sign in</Link></p>
                    </Modal.Body>
                </Modal>
            }
        </Fragment>
    )
})

Modalpopup.displayName="Modalpopup"
export default Modalpopup
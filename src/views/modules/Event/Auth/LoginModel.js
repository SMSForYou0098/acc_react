import React, { memo, Fragment, useEffect, useState } from 'react'
import { Row, Col, Form, Button, Modal, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { AlertIcon } from '../CustomHooks/CustomIcon'
import { useDispatch } from "react-redux";
import axios from 'axios'
import { signIn } from '../../../../store/slices/authSlice';
import { PasswordField } from '../CustomComponents/CustomFormFields';
import { ChevronLeft } from 'lucide-react';
import { handleVerifyPassword } from './pages/VerifyPassword';
import { useMyContext } from '../../../../Context/MyContextProvider';
const MODAL_VIEWS = {
    SIGN_IN: 'SIGN_IN',
    SIGN_UP: 'SIGN_UP',
    OTP: 'OTP',
    PASSWORD: 'PASSWORD'
};

const LoginModel = memo((props) => {
    const { modelShow, handleClose, api, onLoginSuccess } = props;
    const {successAlert} = useMyContext();
    const dispatch = useDispatch();
    const history = useNavigate()
    // States
    const [currentView, setCurrentView] = useState(MODAL_VIEWS.SIGN_IN);
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timerVisible, setTimerVisible] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [credential, setCredential] = useState('');
    const [otp, setOTP] = useState('');
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [password, setPassword] = useState('');
    const [countdown, setCountdown] = useState(30);
    const [resendCount, setResendCount] = useState(0);
    const MAX_RESEND_ATTEMPTS = 3;
    const RESEND_COOLDOWN = 60; // seconds

    useEffect(() => {
        let timer;
        if (timerVisible && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [timerVisible, countdown]);

    useEffect(() => {
        if (countdown === 0) {
            setTimerVisible(false);
        }
    }, [countdown]);

    // Clear error on tab change
    useEffect(() => {
        setError('');
    }, [currentView]);

    // Handlers
    const handleLogin = async (data) => {
        let crd = credential || data;
        if (!crd) {
            setError('Please Enter The Mobile No / Email Address');
            return;
        }

        const lastResendKey = `lastOtpResendTime_${crd}`;
        const lastResendTime = localStorage.getItem(lastResendKey);
        const currentTime = Date.now();
        
        if (lastResendTime && (currentTime - parseInt(lastResendTime)) < (RESEND_COOLDOWN * 1000)) {
            setError(`Please wait ${RESEND_COOLDOWN} seconds before requesting new OTP`);
            return;
        }

        if (resendCount >= MAX_RESEND_ATTEMPTS) {
            setError('Maximum OTP resend attempts reached. Please try again later.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${api}verify-user`, { data: crd });
            if (response.data.status) {
                if (response.data.pass_req) {
                    setCurrentView(MODAL_VIEWS.PASSWORD);
                    setCredential({
                        data: crd,
                        ...response.data 
                    });
                } else {
                    setError(false);
                    setTimerVisible(true);
                    setCountdown(30);
                    setCurrentView(MODAL_VIEWS.OTP);
                    setOtpSent(true);
                    setOTP('');
                    setResendCount(prev => prev + 1);
                    localStorage.setItem(lastResendKey, currentTime?.toString());
                }
            }
        } catch (err) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const isEmail = emailRegex.test(crd);
            if (isEmail) {
                setEmail(crd);
                setNumber('');
            } else {
                setNumber(crd);
                setEmail('');
            }
            setError('');
            setCurrentView(MODAL_VIEWS.SIGN_UP);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            setError('Please enter OTP');
            return;
        }
       
        try {
            const data = { otp, number: credential }
            const user = await dispatch(signIn(data))
            if (user?.type === 'login/fulfilled') {
                onLoginSuccess(user?.payload?.status);
                handleClose();
            }   else {
                setError(user?.payload)
                setAttempts(prev => prev + 1);
                if (attempts >= 2) {
                    // handleClose();
                }
            }
        } catch (err) {
            alert(err.response.data.error)
            setError(err.response.data.error);
            setAttempts(prev => prev + 1);
            if (attempts >= 2) {
               // handleClose();
            }
        }
    };

    const handleSignUp = async () => {
        setLoading(true);
        if (!name || !number) {
            setError('Please fill in all fields.');
            return;
        }
         if (email) {
             const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
             if (!emailRegex.test(email)) {
                 setError('Please enter a valid email address.');
                 return;
             }
         }
        try {
            const response = await axios.post(`${api}create-user`, {
                name,
                email,
                number,
                password: number,
                role_id: 4
            });
            if (response.data.status) {
                setCurrentView(MODAL_VIEWS.OTP);
                setCredential(number);
                handleLogin(number);
            }
        } catch (err) {
            setError(err?.response?.data?.error);
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        // Reset all form fields and states
        setError('');
        setOTP('');
        setEmail('');
        setNumber('');
        setName('');
        setCredential('');
        setResendCount(0);
        setLoading(false);
        setCurrentView(MODAL_VIEWS.SIGN_IN);
        setOtpSent(false);
        setTimerVisible(false);
        setCountdown(30);
        setAttempts(0);
        setPassword('');

        // Only remove OTP timer for current number if it exists
        if (credential) {
            localStorage.removeItem(`lastOtpResendTime_${credential}`);
        }

        handleClose();
    };

    const handleBack = () => {
        setCurrentView(MODAL_VIEWS.SIGN_IN);
    };

    const VerifyPassword = async () => {
        const details = {
            password,
            credential: credential.data,
            session_id: credential.session_id,
            auth_session: credential.auth_session,
            passwordRequired  : true,
        };
        const data = await handleVerifyPassword(details, setLoading, dispatch, successAlert, history, setError, setAttempts);
        if(data?.status){
            onLoginSuccess(data?.status);
            handleClose();
        }
    }
    return (
        <Fragment>
            <Modal show={modelShow}
                backdrop="static" centered onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <h6 className="text-center m-0 w-100">
                        {currentView === MODAL_VIEWS.OTP && "OTP Verification"}
                        {currentView === MODAL_VIEWS.SIGN_UP && "Sign Up"}
                        {currentView === MODAL_VIEWS.SIGN_IN && "Sign In"}
                        {currentView === MODAL_VIEWS.PASSWORD && "Password Verification"}
                    </h6>
                </Modal.Header>
                <Modal.Body>
                    {currentView === MODAL_VIEWS.OTP ? (
                        <div className="p-3">
                            <div className="form-group">
                                {error &&
                                    <Alert variant="danger d-flex align-items-center" role="alert">
                                        <AlertIcon />
                                        <div>
                                            {error}
                                        </div>
                                    </Alert>
                                }
                                <input
                                    type="number"
                                    value={otp}
                                    className="form-control mb-0"
                                    placeholder="Please Enter Your OTP"
                                    onChange={(e) => setOTP(e.target.value)}
                                />
                            </div>
                            <div className="d-flex gap-3 justify-content-center">
                                <div className="text-center pb-3">
                                    <Button type="button" variant="secondary"
                                        onClick={() => handleVerifyOtp()}
                                    >Submit</Button>
                                </div>
                                <div className="text-center pb-3">
                                    <Button type="button" variant="primary"
                                        onClick={handleBack}
                                    >Change Number</Button>
                                </div>

                            </div>
                            <div className="text-center pb-3">
                                <p className="my-3 fs-6">OTP sent on your Mobile No and Email</p>
                                {
                                    timerVisible && otpSent ? (
                                        <div>
                                            <p>Resend OTP in {countdown} seconds</p>
                                        </div>
                                    )
                                        :
                                        <Button 
                                            onClick={() => handleLogin()} 
                                            disabled={loading}
                                        >
                                            {loading ? 'Sending...' : 'Resend OTP'}
                                        </Button>
                                }
                            </div>
                        </div>
                    ) : currentView === MODAL_VIEWS.SIGN_UP ? (
                        <>
                            <div className="p-3">
                                {error &&
                                    <Alert variant="danger d-flex align-items-center" role="alert">
                                        <AlertIcon />
                                        <div>
                                            {error}
                                        </div>
                                    </Alert>
                                }
                                <Row className="d-flex justify-content-between">
                                     <Col sm={12} md={6}>
                                        <Form.Group controlId="Phone_NO">
                                            <Form.Label>Phone No.</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Phone Number"
                                                value={number}
                                                required
                                                onChange={(e) => setNumber(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12} md={6}>
                                        <Form.Group controlId="firstName">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Name"
                                                value={name}
                                                required
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="d-flex justify-content-between">
                                    <Col sm="12" md="12" className="form-group">
                                        <Form.Label className="form-label" htmlFor="Emailid" >Email</Form.Label>
                                        <input
                                            type="email"
                                            className="form-control mb-0"
                                            id="Emailid"
                                            placeholder="Enter Email"
                                            value={email}
                                            // required
                                            onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                        />
                                    </Col>
                                </Row>
                                <div className="text-center pb-3">
                                    <input type="checkbox" className="form-check-input" id="aggrement-hopeui" />
                                    <Form.Label className="form-check-label ms-1" htmlFor="aggrement-hopeui">I agree with the terms of use</Form.Label>
                                </div>
                                <div className="text-center pb-3">
                                    <Button type="button" className="btn btn-secondary"
                                        onClick={handleSignUp}
                                    >Sign Up</Button>
                                </div>
                            </div>
                            <p className="text-center">Already have an Account
                                <Link to="#" className="ms-2" onClick={() => setCurrentView(MODAL_VIEWS.SIGN_IN)}>
                                    Sign in
                                </Link>
                            </p>
                        </>
                    ) : currentView === MODAL_VIEWS.PASSWORD ? (
                        <div className="p-3">
                            <div className="form-group">
                                {error &&
                                    <Alert variant="danger d-flex align-items-center" role="alert">
                                        <AlertIcon />
                                        <div>{error}</div>
                                    </Alert>
                                }
                                <Form.Group controlId="password">
                                    {/* <Form.Label>Password</Form.Label> */}
                                    <PasswordField
                                        value={password}
                                        setPassword={setPassword}
                                        handleKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                VerifyPassword();
                                            }
                                        }}
                                    />
                                </Form.Group>
                            </div>
                            {/* <div className="d-flex justify-content-between align-items-center mb-3">
                                <Link to="/auth/reset-password">Forgot password?</Link>
                            </div> */}
                            <div className="text-center pb-3">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    disabled={loading}
                                    onClick={VerifyPassword}
                                >
                                    {loading ? 'Please Wait...' : 'Login'}
                                </Button>
                            </div>
                            <div className="text-center pb-3">
                                <Button
                                    type="button"
                                    variant="link"
                                    onClick={handleBack}
                                >
                                   <ChevronLeft size={16}/> Back to Login
                                </Button>
                            </div>
                        </div>
                    ) :
                        (
                            <>
                                <div className="p-3">
                                    <div className="form-group">
                                        {error &&
                                            <Alert variant="danger d-flex align-items-center" role="alert">
                                                <AlertIcon />
                                                <div>
                                                    {error}
                                                </div>
                                            </Alert>
                                        }
                                        <input type="email" className="form-control mb-0" id="email-id" placeholder="Enter email or mobile number" onChange={(e) => setCredential(e.target.value)} />
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <Form.Check className="form-check d-inline-block pt-1 mb-0">
                                            <input type="checkbox" className="form-check-input" id="customCheck11" />
                                            <Form.Label className="form-check-label" htmlFor="customCheck11">Remember Me</Form.Label>
                                        </Form.Check>
                                        {/* <Link to="/auth/reset-password">Forgot password</Link> */}
                                    </div>
                                    <div className="text-center pb-3">
                                        <Button type="button" className="secondary" disabled={loading} onClick={() => handleLogin()}>{loading ? 'Please Wait...' : 'Sign in'}</Button>
                                    </div>
                                </div>
                                <p className="text-center">Don't have account?<Link to="#" className="ms-2" onClick={() => setCurrentView(MODAL_VIEWS.SIGN_UP)}> Click here to sign up.</Link></p>
                            </>
                        )}
                </Modal.Body>
            </Modal>
        </Fragment>
    )
})

LoginModel.displayName = "LoginModel"
export default LoginModel
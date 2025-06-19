import React, { memo, Fragment, useState, useEffect } from 'react'

// React-bootstrap
import { Row, Col, Form, Button, Card, Alert } from 'react-bootstrap'

//Components
import { useLocation, useNavigate } from 'react-router-dom'
import Autheffect from '../components/auth-effect'
import { useDispatch } from 'react-redux'
import { logout, signIn } from '../../../../../store/slices/authSlice'
import axios from 'axios'
import { useMyContext } from '../../../../../Context/MyContextProvider'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Twofactor = memo(() => {
    const { api, successAlert } = useMyContext();
    let history = useNavigate();
    const dispatch = useDispatch();
    let location = useLocation();
    let number = location?.state?.data;
    let path = location?.state?.path;
    const [otp, setOTP] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [timerVisible, setTimerVisible] = useState(true);
    const [otpSent, setOtpSent] = useState(true);
    const [countdown, setCountdown] = useState(30);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (number) {
            //handleSendOtp()
            toast.success('OTP has been sent successfully!');
        } else {
            navigate('/sign-in')
        }
    }, []);
    useEffect(() => {
        setOTP('');
        setAttempts(0);
        setError('');
        setLoading(false);

        const isConfirmedLeave = sessionStorage.getItem('isConfirmedLeave');
        if (isConfirmedLeave) {
            navigate('/sign-in');
            sessionStorage.removeItem('isConfirmedLeave');
        }
        const handleBeforeUnload = (event) => {
            const confirmationMessage = 'Are you sure you want to leave? Your current data will be lost.';
            event.returnValue = confirmationMessage;
            return confirmationMessage;
        };

        const handleUnload = (event) => {
            sessionStorage.setItem('isConfirmedLeave', 'true');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('unload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('unload', handleUnload);
        };
    }, [navigate]);

    useEffect(() => {
        let timer;
        if (timerVisible && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);
        }
        if (countdown === 0) {
            setOtpSent(false)
        }
        return () => clearInterval(timer);
    }, [timerVisible, countdown]);

    useEffect(() => {
        if (countdown === 0) {
            setTimerVisible(false);
        }
    }, [countdown]);

    const handleVerifyOtp = async () => {
        if (otp) {
            setLoading(true)
            const data = { otp, number }
            const user = await dispatch(signIn(data))
            if (user?.type === 'login/fulfilled') {
                setLoading(false)
                successAlert('Success', 'Login Successfully')
                history(path ?? '/dashboard');
            } else {
                setLoading(false)
                setError(user?.payload)
            }
        } else {
            setLoading(false)
            setAttempts(prevAttempts => prevAttempts + 1);
            if (attempts >= 2) {
                dispatch(logout())
            }
        }
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && otp) {
            handleVerifyOtp();
        }
    };
    const handleSendOtp = async () => {
        try {
            setLoading(true)
            setOTP('')
            await axios.post(`${api}verify-user`, { data: number })
            setTimerVisible(true)
            setOtpSent(true)
            setLoading(false)
            toast.success('OTP has been re-sent successfully!');
        } catch (err) {
            setLoading(false)
            console.log(err)
        }
    }
    return (
        <Fragment>
            <ToastContainer />
            <div className="iq-auth-page">
                <Autheffect />
                <Row className="align-items-center iq-auth-container w-100">
                    <Col lg="4" className="col-10 offset-lg-7 offset-1">
                        <Card>
                            <Card.Body>
                                <h4 className="pb-2">Two Step-Verification</h4>
                                {/* <p className='h6'>Enter your email address and we’ll send you an email with instructions to verify</p> */}
                                <div className="form-group me-3">
                                    {error &&
                                        <Alert variant="danger d-flex align-items-center" role="alert">
                                            <svg className="me-2" id="exclamation-triangle-fill" fill="currentColor" width="20" viewBox="0 0 16 16">
                                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                                            </svg>
                                            <div>
                                                {error}
                                            </div>
                                        </Alert>
                                    }
                                    <Form.Label htmlFor="otp01" className='h6'>Enter the OTP you recieved on your registered mobile number and email address</Form.Label>
                                    <Form.Control value={otp} type="email" className="mb-0" id="otp01" placeholder="Enter OTP" onChange={(e) => setOTP(e.target.value)} onKeyDown={handleKeyDown} autoFocus />
                                </div>
                                <Button className='me-2' onClick={() => handleVerifyOtp()} disabled={(otp || !loading) ? false : true}>{loading ? 'Please Wait...' : 'Verify'}</Button>
                                {
                                    timerVisible && otpSent ? (
                                        <div className='text-center pb-3 h6'>
                                            <p>Resend OTP in {countdown} seconds</p>
                                        </div>
                                    )
                                        :
                                        <Button className='btn-secondary' onClick={() => handleSendOtp()} disabled={loading}>{loading ? 'Please Wait...' : 'Resend OTP'}</Button>
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Fragment>
    )
})

Twofactor.displayName = "Twofactor"
export default Twofactor

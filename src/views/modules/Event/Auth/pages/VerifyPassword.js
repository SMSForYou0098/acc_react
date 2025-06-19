import React, { memo, Fragment, useState, useEffect } from 'react'
import { Row, Col, Form, Button, Card, Alert } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import Autheffect from '../components/auth-effect'
import { useDispatch } from 'react-redux'
import { logout, signIn } from '../../../../../store/slices/authSlice'
import { useMyContext } from '../../../../../Context/MyContextProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { AlertCircle } from 'lucide-react'
import { PasswordField } from '../../CustomComponents/CustomFormFields'

export const handleVerifyPassword = async (details, setLoading, dispatch, successAlert, history, to, setError, setAttempts) => {
    if (details.password) {
        setLoading(true)
        const data = { password: details.password, number: details.number, passwordRequired: details.passwordRequired, session_id: details.session_id, auth_session: details.auth_session }
        const user = await dispatch(signIn(data))
        if (user?.type === 'login/fulfilled') {
            setLoading(false)
            successAlert('Success', 'Login Successfully')
            // history('/dashboard');
            if(to){
                history(to);
            }
            return user?.payload
        } else {
            setLoading(false)
            setError(user?.payload)
        }
    } else {
        setLoading(false)
        setAttempts(prevAttempts => prevAttempts + 1);
        if (details?.attempts >= 2) {
            dispatch(logout())
        }
    }
};
const VerifyPassword = memo(() => {
    const { successAlert } = useMyContext();
    let history = useNavigate();
    const dispatch = useDispatch();
    let location = useLocation();
    let number = location?.state?.info?.data;
    let session_id = location?.state?.info?.session_id;
    let passwordRequired = location?.state?.info?.password_required;
    let auth_session = location?.state?.info?.auth_session;
    const [password, setPassword] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!number) {
            navigate('/sign-in')
        }
    }, []);

    useEffect(() => {
        setPassword('');
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

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && password) {
            VerifyPassword();
        }
    };

    const VerifyPassword = () => {
        const details = {
            password,
            session_id,
            auth_session,
            passwordRequired: true,
        };
        let to = '/dashboard';
        handleVerifyPassword(details, setLoading, dispatch, successAlert, history, to, setError, setAttempts);
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
                                <div className="form-group me-3">
                                    {error && (
                                        <Alert variant="danger d-flex align-items-center" role="alert">
                                            <div className="d-flex gap-2">
                                                <AlertCircle />
                                                {error}
                                            </div>
                                        </Alert>
                                    )}
                                    <Form.Label htmlFor="password01" className="h6" autoFocus>Enter your password to verify</Form.Label>
                                    <div className="input-group">
                                        <PasswordField value={password} setPassword={setPassword} handleKeyDown={handleKeyDown} />
                                    </div>
                                </div>
                                <Button className="me-2 mt-2" onClick={VerifyPassword} disabled={!password || loading}>
                                    {loading ? "Please Wait..." : "Verify"}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Fragment>
    )
})

VerifyPassword.displayName = "VerifyPassword"
export default VerifyPassword

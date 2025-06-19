import React, { Fragment, useState } from "react";
import { Row, Col, Form, Button, Alert, Card } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Autheffect from "../components/auth-effect";
import { useMyContext } from "../../../../../Context/MyContextProvider";
import { useSelector } from "react-redux";
import axios from "axios";
import { AlertIcon } from "../../CustomHooks/CustomIcon";
import { Home } from "lucide-react";
const Signin = (() => {
  const { api } = useMyContext();
  let history = useNavigate();
  const [data, setData] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.auth?.user);
  const DataLength = (user && Object.keys(user)?.length) || 0;
  if (DataLength > 0) {
    return <Navigate to="/dashboard" />
  }


  const handleLogin = async () => {
    if (!data) {
      setError('Please enter your email or mobile number.');
      return;
    }
    try {
      setLoading(true)
      const response = await axios.post(`${api}verify-user`, { data })
      if (response.data.status) {
        let isPassReq = response.data?.pass_req
        if (isPassReq === true) {
          let session_id = response.data.session_id
          let auth_session = response.data.auth_session
          let info = { data, password_required: isPassReq, session_id, auth_session }
          history('/verify-password', { state: { info } })
        } else {
          history('/two-factor', { state: { data } })
        }
        setLoading(false)
      } else {
        setLoading(false)
      }

    } catch (err) {
      history('/sign-up', { state: { data } })
      setError(err.response.data.message || err.response.data.error)
      setLoading(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && data) {
      handleLogin();
    }
  };

  return (
    <Fragment>

      <div className="iq-auth-page">
        <Autheffect />
        <Row className="d-flex align-items-center iq-auth-container w-100">
          <Col xl="4" className="col-10 offset-xl-7 offset-1">
            <Card>
              <Card.Body>
                <h3 className="text-center">Sign In</h3>
                {/* <p className="text-center h6">Sign in to stay connected</p> */}
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
                    type="email"
                    className="form-control mb-0"
                    id="email-id"
                    placeholder="Enter email or mobile number"
                    onChange={(e) => setData(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Check className="form-check d-inline-block pt-1 mb-0 text-dark">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="customCheck11"
                    />
                    <Form.Check.Label
                      htmlFor="customCheck11"
                    >
                      Remember Me
                    </Form.Check.Label>
                  </Form.Check>
                  <div className="d-flex justify-content-end mb-3">
                    <Link to="/" className="d-flex align-items-center">
                      Go To Home
                      <Home size={18} className="ms-1" />
                    </Link>
                  </div>
                </div>
                <div className="text-center pb-3">
                  <Button onClick={() => handleLogin()} disabled={loading}>{loading ? 'Please Wait...' : 'Sign in'}</Button>
                </div>
                <div className="text-center">
                  <p className="mb-0 text-dark">
                    Don't have an account?{" "}
                    <Link to="/sign-up" className="text-primary">Sign Up</Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
});

Signin.displayName = "Signin";
export default Signin;

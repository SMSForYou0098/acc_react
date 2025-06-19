import React, { Fragment, useEffect, useState } from "react";
import { Row, Col, Form, Button, Alert, Card } from "react-bootstrap";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Autheffect from "../components/auth-effect";
import { useMyContext } from "../../../../../Context/MyContextProvider";
import { useSelector } from "react-redux";
import axios from "axios";
import { AlertIcon } from "../../CustomHooks/CustomIcon";
import { Home } from "lucide-react";
import { motion,AnimatePresence } from "framer-motion";

const Signup = () => {
  const { api } = useMyContext();
  let history = useNavigate();
  const location = useLocation();
  let data = location?.state?.data;
  const [formData, setFormData] = useState({
    email: '',
    number: '',
    name: '',
    password: '',
    role_id: 4
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const user = useSelector((state) => state.auth?.user);
  const DataLength = (user && Object.keys(user)?.length) || 0;

  useEffect(() => {
    if (data) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isEmail = emailRegex.test(data);
      const isPhone = /^\d{10}$/.test(data) || /^\d{12}$/.test(data);
      if (isEmail) {
        setFormData({ ...formData, email: data });
      } else if (isPhone) {
        setFormData({ ...formData, number: data });
      } else {
        setError('Please enter a valid email or phone number.');
      }
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (DataLength > 0) {
    return <Navigate to="/dashboard" />
  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      password: name === 'number' ? value : prev.password
    }));
  };

  const handleSignup = async () => {
    if (!formData.email || !formData.number || !formData.name) {
      setError('Please fill all required fields.');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${api}create-user`, formData);
      if (response.data.status) {
        // dispatch(setUser(response.data.user));
        let data = response.data.user?.number;
        handleLogin(data);
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const handleLogin = async (data) => {
    if (!data) {
      setError('Please enter your email or mobile number.');
      return;
    }
    try {
      setLoading(true)
      const response = await axios.post(`${api}verify-user`, { data })
      if (response.data.status) {
        let isPassReq = response.data?.pass_req
        let path = '/'
        if (isPassReq === true) {
          let session_id = response.data.session_id
          let auth_session = response.data.auth_session
          let info = { data, password_required: isPassReq, session_id, auth_session }
          history('/verify-password', { state: { info } })
        } else {
          history('/two-factor', { state: { data, path } })
        }
        setLoading(false)
      } else {
        setLoading(false)
      }

    } catch (err) {
      setError(err.response.data.message || err.response.data.error)
      setLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    handleSignup();
  };


  return (
    <Fragment>
      <div className="iq-auth-page">
        <Autheffect />
        <Row className="d-flex align-items-center iq-auth-container w-100">
          <Col xl="4" className="col-10 offset-xl-7 offset-1">
            <Card>
              <Card.Body>
                <h3 className="text-center">Sign Up</h3>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Alert variant="danger d-flex align-items-center" role="alert">
                          <AlertIcon />
                          <div>{error}</div>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Control
                          required
                          type="text"
                          name="name"
                          value={formData.name}
                          placeholder="Enter your name"
                          onChange={handleChange}
                          pattern="[A-Za-z ]{3,}"
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter a valid name (minimum 3 characters)
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Control
                          required
                          type="text"
                          name="number"
                          value={formData.number}
                          placeholder="Enter phone number"
                          onChange={handleChange}
                          pattern="^(?:\d{10}|\d{12})$"
                          maxLength={12}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter either 10 or 12 digit phone number
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Control
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          placeholder="Enter email"
                          onChange={handleChange}
                          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter a valid email address (e.g., example@domain.com)
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-end mb-3">
                    <Link to="/" className="d-flex align-items-center">
                      Go To Home
                      <Home size={18} className="ms-1" />
                    </Link>
                  </div>
                  <div className="text-center pb-3">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Please Wait...' : 'Sign Up'}
                    </Button>
                  </div>
                  <div className="text-center">
                    <p className="mb-0 text-dark">
                      Already have an account?{" "}
                      <Link to="/sign-in" className="text-primary">Sign In</Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

Signup.displayName = "Signup";
export default Signup;
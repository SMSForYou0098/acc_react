import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useMyContext } from '../../../../../Context/MyContextProvider';


const RazorPay = ({gateway,user}) => {
  const { api, successAlert, UserData, ErrorAlert,authToken } = useMyContext();
  const [razorpayKey, setRazorpayKey] = useState('');
  const [razorpaySecret, setRazorpaySecret] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (gateway) {
      setRazorpayKey(gateway.razorpay_key);
      setRazorpaySecret(gateway.razorpay_secret);
      setStatus(gateway.status === 1);
    } else{
      setRazorpayKey('');
      setRazorpaySecret('');
      setStatus(false);
    }
  }, [gateway]);
  const handleSubmit = async () => {
    try {
      await axios.post(`${api}store-razorpay`, {
        user_id: user ? user : UserData.id,
        razorpay_key: razorpayKey,
        razorpay_secret: razorpaySecret,
        status : status ? 1 : 0,
      }, {
        headers: {
          'Authorization': 'Bearer ' + authToken,
        }
      });
      successAlert('Success', 'Razorpay credentials stored successfully!');
    } catch (error) {
      ErrorAlert('Error', 'Failed to store Razorpay credentials.!');
    }
  };

  useEffect(() => {
    
  }, []);

  return (
    <Form>
      <Row>
        <Col lg="6">
          <Form.Group className="mb-3 form-group">
            <Form.Label className="custom-file-input">Razorpay Key</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              value={razorpayKey}
              onChange={(e) => setRazorpayKey(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col lg="6">
          <Form.Group className="mb-3 form-group">
            <Form.Label className="custom-file-input">Razorpay Secret</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              value={razorpaySecret}
              onChange={(e) => setRazorpaySecret(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col lg="6">
          <Form.Label className="custom-file-input">Status</Form.Label>
          <Row>
            <Col lg="6" className='d-flex gap-3'>
              <div className="form-radio form-check">
                <Form.Check.Input
                  type="radio"
                  id="enableRadio"
                  name="payment"
                  className="me-2"
                  //value="Enable"
                  checked={status}
                  onChange={(e) => setStatus(true)}
                />
                <Form.Label
                  className="custom-control-label"
                  htmlFor="enableRadio"
                >
                  Enable
                </Form.Label>
              </div>
              <div className="form-radio form-check">
                <Form.Check.Input
                  type="radio"
                  id="disableRadio"
                  name="payment"
                  className="me-2"
                  //value="Disable"
                  checked={!status}
                  onChange={(e) => setStatus(false)}
                />
                <Form.Label
                  className="custom-control-label"
                  htmlFor="disableRadio"
                >
                  Disable
                </Form.Label>
              </div>
            </Col>
          </Row>
        </Col>
        <div className='d-flex justify-content-end'>
          <Button type="button" onClick={handleSubmit}>Submit</Button>
        </div>
      </Row>
    </Form>
  );
};

export default RazorPay;
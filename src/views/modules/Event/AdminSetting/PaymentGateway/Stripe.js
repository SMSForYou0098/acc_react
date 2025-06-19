import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { useMyContext } from '../../../../../Context/MyContextProvider';

const Stripe = () => {
  const { api, successAlert, UserData, ErrorAlert,authToken } = useMyContext();
  const [stripeKey, setStripeKey] = useState('');
  const [stripeSecret, setStripeSecret] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.post(`${api}store-stripe`, {
        user_id: UserData?.id,
        stripe_key: stripeKey,
        stripe_secret: stripeSecret,
        status,
      }, {
        headers: {
          'Authorization': 'Bearer ' + authToken,
        }
      });
      successAlert('Success', 'Stripe credentials stored successfully!');
    } catch (error) {
      ErrorAlert('Error', 'Failed to store Stripe credentials.');
    }
  };

  return (
    <Form>
      <Row>
        <Col lg="6">
          <Form.Group className="mb-3 form-group">
            <Form.Label className="custom-file-input">Stripe Key</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              value={stripeKey}
              onChange={(e) => setStripeKey(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col lg="6">
          <Form.Group className="mb-3 form-group">
            <Form.Label className="custom-file-input">Stripe Secret</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              value={stripeSecret}
              onChange={(e) => setStripeSecret(e.target.value)}
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
                  id="enableRadioStripe"
                  name="payment"
                  className="me-2"
                  value="Enable"
                  checked={status === 'Enable'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <Form.Label
                  className="custom-control-label"
                  htmlFor="enableRadioStripe"
                >
                  Enable
                </Form.Label>
              </div>
              <div className="form-radio form-check">
                <Form.Check.Input
                  type="radio"
                  id="disableRadioStripe"
                  name="payment"
                  className="me-2"
                  value="Disable"
                  checked={status === 'Disable'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <Form.Label
                  className="custom-control-label"
                  htmlFor="disableRadioStripe"
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

export default Stripe;

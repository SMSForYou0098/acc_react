import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { useMyContext } from '../../../../../Context/MyContextProvider';

const Paytm = () => {
  const { api, successAlert, UserData, ErrorAlert ,authToken} = useMyContext();
  const [merchantId, setMerchantId] = useState('');
  const [merchantKey, setMerchantKey] = useState('');
  const [merchantWebsite, setMerchantWebsite] = useState('');
  const [industryType, setIndustryType] = useState('');
  const [channel, setChannel] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.post(`${api}store-paytm`, {
        user_id: UserData?.id,
        merchant_id: merchantId,
        merchant_key: merchantKey,
        merchant_website: merchantWebsite,
        industry_type: industryType,
        channel: channel,
        status,
      }, {
        headers: {
          'Authorization': 'Bearer ' + authToken,
        }
      });
      successAlert('Success', 'Paytm credentials stored successfully!');
    } catch (error) {
      ErrorAlert('Error', 'Failed to store Paytm credentials.');
    }
  };

  return (
    <Form>
      <Row>
        <Col lg="6">
          <Form.Group className="mb-3 form-group">
            <Form.Label className="custom-file-input">Paytm Merchant ID</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col lg="6">
          <Form.Group className="mb-3 form-group">
            <Form.Label className="custom-file-input">Paytm Merchant Key</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              value={merchantKey}
              onChange={(e) => setMerchantKey(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col lg="6">
          <Form.Group className="mb-3 form-group">
            <Form.Label className="custom-file-input">Paytm Merchant Website</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              value={merchantWebsite}
              onChange={(e) => setMerchantWebsite(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col lg="6">
          <Form.Group className="mb-3 form-group">
            <Form.Label className="custom-file-input">Paytm Industry Type</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              value={industryType}
              onChange={(e) => setIndustryType(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col lg="6">
          <Form.Group className="mb-3 form-group">
            <Form.Label className="custom-file-input">Paytm Channel</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
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
                  id="enableRadioPaytm"
                  name="payment"
                  className="me-2"
                  value="Enable"
                  checked={status === 'Enable'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <Form.Label
                  className="custom-control-label"
                  htmlFor="enableRadioPaytm"
                >
                  Enable
                </Form.Label>
              </div>
              <div className="form-radio form-check">
                <Form.Check.Input
                  type="radio"
                  id="disableRadioPaytm"
                  name="payment"
                  className="me-2"
                  value="Disable"
                  checked={status === 'Disable'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <Form.Label
                  className="custom-control-label"
                  htmlFor="disableRadioPaytm"
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

export default Paytm;

import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useMyContext } from '../../../../../Context/MyContextProvider';
import axios from 'axios';
const Instamozo = ({ gateway,user }) => {
  const { api, successAlert, UserData, ErrorAlert, authToken } = useMyContext();
  const [instamojoApiKey, setInstamojoApiKey] = useState();
  const [instamojoAuthToken, setInstamojoAuthToken] = useState();
  const [status, setStatus] = useState();
  useEffect(() => {
    if (gateway) {
      setInstamojoApiKey(gateway.instamojo_api_key);
      setInstamojoAuthToken(gateway.instamojo_auth_token);
      setStatus(Number(gateway.status));
    }else{
      setInstamojoApiKey('');
      setInstamojoAuthToken('');
      setStatus(0);
    }
  }, [gateway]);
  const handleSubmit = async () => {
    try {
      await axios.post(`${api}store-instamojo`, {
        user_id: user? user :UserData?.id,
        instamojo_api_key: instamojoApiKey,
        instamojo_auth_token: instamojoAuthToken,
        status: Number(status),
      }, {
        headers: {
          'Authorization': 'Bearer ' + authToken,
        }
      });
      successAlert('Success', 'Instamojo credentials stored successfully!');
    } catch (error) {
      ErrorAlert('Error', 'Failed to store Instamojo credentials.');
    }
  };
  return (
    <Form>
      <Row>
        <Col lg="6">
          <Form.Group className="mb-3 form-group">
            <Form.Label className="custom-file-input">InstaMozo Private API Key</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              value={instamojoApiKey}
              onChange={(e) => setInstamojoApiKey(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col lg="6">
          <Form.Group className="mb-3 form-group">
            <Form.Label className="custom-file-input">InstaMozo Private Auth Token</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              value={instamojoAuthToken}
              onChange={(e) => setInstamojoAuthToken(e.target.value)}
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
                  checked={Number(status) === 1}
                  onChange={() => setStatus(1)}
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
                  checked={Number(status) === 0}
                  onChange={() => setStatus(0)}
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
  )
}

export default Instamozo
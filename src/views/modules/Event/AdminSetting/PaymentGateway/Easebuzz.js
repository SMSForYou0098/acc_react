import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import Select from "react-select";
import { useMyContext } from '../../../../../Context/MyContextProvider';
const Easebuzz = ({ gateway ,user}) => {
  const { api, successAlert, UserData, ErrorAlert, authToken } = useMyContext();
  const [easebuzzKey, setEasebuzzKey] = useState('');
  const [easebuzzSalt, setEasebuzzSalt] = useState('');
  const [status, setStatus] = useState();
  const [environment, setEnvironment] = useState(null);
  const [testUrl, setTestUrl] = useState("");
  const [productionUrl, setProductionUrl] = useState("");

  useEffect(() => {
    if (gateway) {
      setStatus(gateway.status === 1 ? true : false);
      setEasebuzzKey(gateway.merchant_key);
      setEasebuzzSalt(gateway.salt);
      setEnvironment(gateway.env);
      setTestUrl(gateway.test_url);
      setProductionUrl(gateway.prod_url);
    } else{
      //reset states
      setStatus(false);
      setEasebuzzKey("");
      setEasebuzzSalt("");
      setEnvironment(null);
      setTestUrl("");
      setProductionUrl("");

    }
  }, [gateway]);

  const handleSubmit = async () => {
    try {
      await axios.post(`${api}store-easebuzz`, {
        user_id: user ? user : UserData?.id,
        easebuzz_key: easebuzzKey,
        easebuzz_salt: easebuzzSalt,
        env: environment,
        status: status  ? 1 : 0,
        test_url : testUrl,
        prod_url : productionUrl,
      }, {
        headers: {
          'Authorization': 'Bearer ' + authToken,
        }
      });
      successAlert('Success', 'Easebuzz credentials stored successfully!');
    } catch (error) {
      ErrorAlert('Error', 'Failed to store Easebuzz credentials.');
    }
  };

  const options = [
    { value: "test", label: "Test" },
    { value: "prod", label: "Production" },
  ];

  return (
    <Form>
      <Row>
        <Col lg="6">
          <Form.Group className="mb-3 form-group">
            <Form.Label className="custom-file-input">Easebuzz Merchant Key</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              value={easebuzzKey}
              onChange={(e) => setEasebuzzKey(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col lg="6">
          <Form.Group className="mb-3 form-group">
            <Form.Label className="custom-file-input">Easebuzz Salt</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              value={easebuzzSalt}
              onChange={(e) => setEasebuzzSalt(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col lg="6" className="mb-3 form-group">
          <Form.Label className="custom-file-input">Status</Form.Label>
          <Row>
            <Col lg="6" className='d-flex gap-3'>
              <div className="form-radio form-check">
                <Form.Check.Input
                  type="radio"
                  id="enableRadio"
                  name="payment"
                  className="me-2"
                  // value="Enable"
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
                  // value="Disable"
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
        <Col lg="6" className="mb-3 form-group">
          <Form.Group>
            <Form.Label>Select Environment</Form.Label>
            <Select
              options={options}
              value={options?.find((opt) => opt?.value === environment)}
              onChange={(selectedOption) => setEnvironment(selectedOption.value)}
              placeholder="Choose environment..."
              isSearchable={true}
            />
          </Form.Group>
        </Col>
        <Col lg="6" className="mb-3 form-group">
        <Form.Group >
          <Form.Label>Test Env URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Test Env URL"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
          />
        </Form.Group>
      </Col>

      {/* Production Env URL */}
      <Col lg="6" className="mb-3 form-group">
        <Form.Group>
          <Form.Label>Production Env URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Production Env URL"
            value={productionUrl}
            onChange={(e) => setProductionUrl(e.target.value)}
          />
        </Form.Group>
      </Col>
        <div className='d-flex justify-content-end'>
          <Button type="button" onClick={handleSubmit}>Submit</Button>
        </div>
      </Row>
    </Form>
  );
};

export default Easebuzz;

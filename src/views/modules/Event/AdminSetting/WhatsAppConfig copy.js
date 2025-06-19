import React, { Fragment, useEffect, useState } from 'react'
import { Card, Col, Row, Form, Button, InputGroup, Badge } from 'react-bootstrap'
import axios from 'axios';
import Select from 'react-select';
import { useMyContext } from '../../../../Context/MyContextProvider';
import SytemVariables, { SystemVars } from './SytemVariables';

const WhatsAppConfig = () => {
    const { api, successAlert, UserData, authToken } = useMyContext();
    const [customShow, setCustomShow] = useState();
    const [apiKey, setApiKey] = useState('');
    const [senderId, setSenderId] = useState('');
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState(false);
    const [badges, setBadges] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const options = SystemVars.map((item) => ({
        value: item.key,
        label: `${item.value} (${item.key})`,
    }));

    ///sms config
    const GetSMSConfig = async () => {
        try {
            const res = await axios.get(`${api}sms-api/${UserData?.id}`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data.status) {
                const configData = res.data;
                setApiKey(configData?.config?.api_key || '');
                setSenderId(configData?.config?.sender_id || '');
                setUrl(configData?.custom?.url || '');
                setStatus(configData.config.status === "1");
            }
        } catch (err) {
            // console.log(err);
        }
    };
    useEffect(() => {
        GetSMSConfig()
    }, []);

    const HandleSubmit = async () => {
        try {
            const payload = { user_id: UserData?.id, status: status };
            let apiUrl = customShow ? `${api}store-custom-api/${UserData?.id}` : `${api}store-api`;
            if (customShow) {
                payload.url = url;
                payload.sms = 'custom';
            } else {
                payload.api_key = apiKey;
                payload.sender_id = senderId;
                payload.sms = 'default';
            }
            const response = await axios.post(apiUrl, payload, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (response.data.status) {
                GetSMSConfig()
                successAlert(response.data?.message)
            }
        } catch (error) {
            // console.log(error);
        }
    }

    const removeBadge = (index) => {
        setBadges((prev) => prev.filter((_, i) => i !== index));
    };

    const handleInputKeyDown = (e) => {
        if (e.key === ',' || e.key === 'Enter') {
            e.preventDefault();
            const newBadge = inputValue.trim();
            if (newBadge && !badges.includes(newBadge)) {
                setBadges((prev) => [...prev, newBadge]);
            }
            setInputValue('');
        }
    };
    const handleSelectChange = (selectedOption) => {
        if (selectedOption) {
            setBadges((prev) => [...prev, selectedOption.value]);
        }
    };
    return (
        <Row>
            <Col lg="8">
                <Row>
                    <Col lg="12">
                        <Card>
                            <Card.Header>
                                <div className='d-flex justify-content-between'>
                                    <h4 className="card-title">WhatsApp Config Settings</h4>
                                    <div className=''>
                                        <Form.Check className="form-switch">
                                            <Form.Check.Input
                                                type="checkbox"
                                                className="me-2"
                                                id="flexSwitchCheckDefault"
                                                onChange={(e) => setCustomShow(e.target.checked)}
                                            />
                                            <Form.Check.Label htmlFor="flexSwitchCheckDefault">
                                                Custom
                                            </Form.Check.Label>
                                        </Form.Check>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Form>
                                    <Row>
                                        {customShow ?
                                            <>
                                                <Col lg="12">
                                                    <Form.Group className="mb-3 form-group">
                                                        <Form.Label className="custom-file-input">Custom API</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            id="exampleFormControlTextarea1"
                                                            rows="3"
                                                            value={url}
                                                            onChange={(e) => setUrl(e.target.value)}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col lg="12">
                                                    <Form.Group className="mb-3 form-group">
                                                        <Form.Label style={{ fontSize: '0.8rem' }} className="custom-file-input me-3">&bull; <strong>:NUMBER</strong> - Use for the mobile number</Form.Label>
                                                        <Form.Label style={{ fontSize: '0.8rem' }} className="custom-file-input me-3">&bull; <strong>:MESSAGE</strong> - Use for message content</Form.Label>
                                                        <Form.Label style={{ fontSize: '0.8rem' }} className="custom-file-input">&bull; <strong>:TID</strong> - Use for template id</Form.Label>
                                                    </Form.Group>
                                                </Col>
                                            </>
                                            :
                                            <>
                                                <Col lg="4">
                                                    <Form.Group className="mb-3 form-group">
                                                        <Form.Label className="custom-file-input">API Key</Form.Label>
                                                        <Form.Control type="text" placeholder="" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                                                    </Form.Group>
                                                </Col>
                                                <Col lg="6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Variables</Form.Label>
                                                        <div
                                                            className={`d-flex flex-column gap-2 flex-wrap ${badges.length>0 && 'p-2'} rounded`}
                                                            style={{ border: '1px solid #e6ebf1' }}
                                                        >
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                                {badges.map((badge, index) => (
                                                                    <div className="custom-dotted-border rounded-2 d-flex p-1" key={index}>
                                                                        <Badge
                                                                            bg="secondary"
                                                                            className="rounded-pill border me-1"
                                                                            style={{ cursor: 'default' }}
                                                                        >
                                                                            {index + 1}
                                                                        </Badge>
                                                                        <Badge
                                                                            bg="info"
                                                                            className="d-flex align-items-center"
                                                                            style={{ paddingRight: '8px', cursor: 'default' }}
                                                                        >
                                                                            {badge}
                                                                        </Badge>
                                                                        <span
                                                                            style={{ marginLeft: '4px', cursor: 'pointer' }}
                                                                            onClick={() => removeBadge(index)}
                                                                        >
                                                                            &times;
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <Select
                                                                options={options}
                                                                isClearable
                                                                isSearchable
                                                                placeholder="Type or select variable"
                                                                onChange={handleSelectChange}
                                                                onInputChange={(value) => setInputValue(value)}
                                                                value={null}
                                                                className="flex-grow-1"
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        background: 'none',
                                                                    }),
                                                                }}
                                                            />
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                            </>
                                        }
                                        {/* <Col lg="3">
                                            <Form.Group className="mb-3 form-group">
                                                <Form.Label className="custom-file-input">Status</Form.Label>
                                                <div className="d-flex gap-2">
                                                    <div className="form-radio form-check">
                                                        <Form.Check.Input
                                                            type="radio"
                                                            id="enableRadio"
                                                            name="payment"
                                                            className="me-2"
                                                            value="true"
                                                            checked={status === true}
                                                            onChange={() => setStatus(true)}
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
                                                            value="false"
                                                            className="me-2"
                                                            checked={status === false}
                                                            onChange={() => setStatus(false)}
                                                        />
                                                        <Form.Label
                                                            className="custom-control-label"
                                                            htmlFor="disableRadio"
                                                        >
                                                            Disable
                                                        </Form.Label>
                                                    </div>
                                                </div>
                                            </Form.Group>
                                        </Col> */}
                                        <div className='d-flex justify-content-end'>
                                            <Button type="button" onClick={() => HandleSubmit()}>Submit</Button>
                                        </div>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col lg="4">
                <Row>
                    <SytemVariables />
                </Row>
            </Col>
        </Row>
    )
}

export default WhatsAppConfig
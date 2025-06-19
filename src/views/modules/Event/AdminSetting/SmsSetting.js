import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row, Form, Button, Table } from 'react-bootstrap'
import useDataTable from '../../../../components/hooks/useDatatable';
import axios from 'axios';
import { useMyContext } from '../../../../Context/MyContextProvider';
import SytemVariables from './SytemVariables';

const SmsSetting = () => {
    const { api, successAlert, UserData, authToken } = useMyContext();
    const [customShow, setCustomShow] = useState();
    const [apiKey, setApiKey] = useState('');
    const [senderId, setSenderId] = useState('');
    const [url, setUrl] = useState('');
    const [templateName, setTemplateName] = useState('');
    const [templateId, setTemplateId] = useState('');
    const [content, setContent] = useState('');
    const [editId, setEidtId] = useState('');
    const [editState, setEditState] = useState(false)
    const [templates, setTemplates] = useState([]);
    const [status, setStatus] = useState(false);
    const columns = [
        { data: "template_id", title: "Name" },
        {
            data: "content",
            title: "Content",
            render: function (content) {
                return content?.length > 30 ? content?.substring(0, 15) + '...' : content;
            },
        },
        {
            data: null,
            orderable: false,
            searchable: false,
            title: "Action",
            render: function (data) {
                return `<div class="flex align-items-center list-user-action">
                                  <button class="btn btn-sm btn-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="Print" data-id=${data?.id} data-method="Edit" data-table="action">
                                     <svg fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-20" width="20" height="32" viewBox="0 0 24 24"><path d="M11.4925 2.78906H7.75349C4.67849 2.78906 2.75049 4.96606 2.75049 8.04806V16.3621C2.75049 19.4441 4.66949 21.6211 7.75349 21.6211H16.5775C19.6625 21.6211 21.5815 19.4441 21.5815 16.3621V12.3341" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path fillRule="evenodd" clipRule="evenodd" d="M8.82812 10.921L16.3011 3.44799C17.2321 2.51799 18.7411 2.51799 19.6721 3.44799L20.8891 4.66499C21.8201 5.59599 21.8201 7.10599 20.8891 8.03599L13.3801 15.545C12.9731 15.952 12.4211 16.181 11.8451 16.181H8.09912L8.19312 12.401C8.20712 11.845 8.43412 11.315 8.82812 10.921Z" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path d="M15.1655 4.60254L19.7315 9.16854" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path></svg>
                                  </button>
                                  <button class="btn btn-sm btn-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="Print" data-id=${data?.id} data-method="Delete" data-table="action">
                                     <svg fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-20" width="20" height="32" viewBox="0 0 24 24"><path d="M19.3248 9.46826C19.3248 9.46826 18.7818 16.2033 18.4668 19.0403C18.3168 20.3953 17.4798 21.1893 16.1088 21.2143C13.4998 21.2613 10.8878 21.2643 8.27979 21.2093C6.96079 21.1823 6.13779 20.3783 5.99079 19.0473C5.67379 16.1853 5.13379 9.46826 5.13379 9.46826" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path d="M20.708 6.23975H3.75" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path></svg>
                                  </button>
                              `;
            },
        },
    ];
    const tableRef = useRef(null);
    useDataTable({
        tableRef: tableRef,
        columns: columns,
        data: templates,
        actionCallback: (data) => {
            switch (data.method) {
                case "Edit":
                    handleEdit(data?.id);
                    break;
                case "Delete":
                    alert(data?.id);
                    break;
                default:
                    break;
            }
        },
        // isFooter: true,
    });

    const handleEdit = async (id) => {
        let data = templates?.find((item) => item?.id === id)
        setEditState(true)
        setTemplateName(data?.template_name);
        setTemplateId(data?.template_id);
        setContent(data?.content);
        setEidtId(data?.id);
    }


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
                setTemplates(configData?.templates);
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

    const SubmitTemplate = async () => {
        try {
            const payload = {
                user_id: UserData?.id,
                template_name: templateName,
                template_id: templateId,
                content: content,
            };
            let apiUrl = editState ? `${api}sms-template-update/${editId}` : `${api}sms-template/${UserData?.id}`;
            const response = await axios.post(apiUrl, payload, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (response.data.status) {
                setEditState(false)
                GetSMSConfig()
                setTemplateName('');
                setTemplateId('');
                setContent('');
                setEidtId('');
                successAlert(response.data?.message)
            }
        } catch (error) {
            // console.log(error);
        }
    }

    return (
        <Row>
            <Col lg="6">
                <Row>
                    <Col lg="12">
                        <Card>
                            <Card.Header>
                                <div className='d-flex justify-content-between'>
                                    <h4 className="card-title">SMS Settings</h4>
                                    <div className=''>
                                        <Form.Check className="form-switch">
                                            <Form.Check.Input
                                                type="checkbox"
                                                className="me-2"
                                                id="flexSwitchCheckDefault"
                                                // checked={eventFeature}
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
                                                <Col lg="4">
                                                    <Form.Group className="mb-3 form-group">
                                                        <Form.Label className="custom-file-input">Sender ID</Form.Label>
                                                        <Form.Control type="text" placeholder="" value={senderId} onChange={(e) => setSenderId(e.target.value)} />
                                                    </Form.Group>
                                                </Col>
                                            </>
                                        }
                                        <Col lg="3">
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
                                        </Col>
                                        <div className='d-flex justify-content-end'>
                                            <Button type="button" onClick={() => HandleSubmit()}>Submit</Button>
                                        </div>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>

                    </Col>
                    <Col lg="12">
                        <Card>
                            <Card.Header>
                                <h4 className="card-title">{editState ? 'Edit' : 'New'} Template</h4>
                            </Card.Header>
                            <Card.Body>
                                <Form>
                                    <Row>
                                        <Col lg="6">
                                            <Form.Group className="mb-3 form-group">
                                                <Form.Label className="custom-file-input">Template Name</Form.Label>
                                                <Form.Control type="text" placeholder="" value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="mb-3 form-group">
                                                <Form.Label className="custom-file-input">Template ID</Form.Label>
                                                <Form.Control type="text" placeholder="" value={templateId} onChange={(e) => setTemplateId(e.target.value)} />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="12">
                                            <Form.Group className="mb-3 form-group">
                                                <Form.Label className="custom-file-input">Template Content</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    id="exampleFormControlTextarea1"
                                                    rows="5"
                                                    value={content}
                                                    onChange={(e) => setContent(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div className='d-flex justify-content-end'>
                                        <Button type="button" className=""
                                            onClick={() => SubmitTemplate()}
                                        >{editState ? 'Update' : 'Submit'} Template</Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col lg="6">
                <Row>
                    <Col lg="12">
                        <Card>
                            <Card.Header>
                                <h4 className="card-title">SMS Templates</h4>
                            </Card.Header>
                            <Card.Body>
                                <table
                                    ref={tableRef}
                                    className="table dataTable"
                                    data-toggle="data-table"
                                ></table>{" "}
                            </Card.Body>
                        </Card>
                    </Col>
                    <SytemVariables/>
                </Row>
            </Col>
        </Row>
    )
}

export default SmsSetting
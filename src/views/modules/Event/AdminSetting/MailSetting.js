import React, { memo, useEffect, useRef, useState } from 'react'
import { Card, Col, Row, Form, Button, Modal, InputGroup } from 'react-bootstrap'
import useDataTable from '../../../../components/hooks/useDatatable';
import axios from 'axios';
import { useMyContext } from '../../../../Context/MyContextProvider';
import JoditEditor from 'jodit-react';
import DOMPurify from 'dompurify';
import { Eye, EyeClosedIcon } from 'lucide-react';
const MailSetting = memo(() => {

    const { api, successAlert, UserData, authToken } = useMyContext();
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setEditState(false)
        setName('');
        setSubject('');
        setMailBody('');
        setTemplateId('')
    }
    const handleShow = () => setShow(true);

    const [mailDriver, setMailDriver] = useState('smtp');
    const [mailHost, setMailHost] = useState('');
    const [mailPort, setMailPort] = useState('');
    const [mailUsername, setMailUsername] = useState('');
    const [mailPassword, setMailPassword] = useState('');
    const [mailEncryption, setMailEncryption] = useState('');
    const [mailFromAddress, setMailFromAddress] = useState('');
    const [mailFromName, setMailFromName] = useState('');
    const [passwordShow, setPasswordShow] = useState(false);
    const [templates, setTemplates] = useState([]);


    const columns = [
        { data: "template_id", title: "Name" },
        { data: "subject", title: "Subject" },
        {
            data: "body",
            title: "Body",
            render: function (body) {
                return body.length > 30 ? body?.substring(0, 15) + '...' : body;
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
                          <button class="btn btn-sm btn-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="Print" data-id=${data?.id} data-method="View" data-table="action">
                             <svg fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M15.1614 12.0531C15.1614 13.7991 13.7454 15.2141 11.9994 15.2141C10.2534 15.2141 8.83838 13.7991 8.83838 12.0531C8.83838 10.3061 10.2534 8.89111 11.9994 8.89111C13.7454 8.89111 15.1614 10.3061 15.1614 12.0531Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.998 19.355C15.806 19.355 19.289 16.617 21.25 12.053C19.289 7.48898 15.806 4.75098 11.998 4.75098H12.002C8.194 4.75098 4.711 7.48898 2.75 12.053C4.711 16.617 8.194 19.355 12.002 19.355H11.998Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button class="btn btn-sm btn-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="Print" data-id=${data?.id} data-method="Delete" data-table="action">
                             <svg fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-20" width="20" height="32" viewBox="0 0 24 24"><path d="M19.3248 9.46826C19.3248 9.46826 18.7818 16.2033 18.4668 19.0403C18.3168 20.3953 17.4798 21.1893 16.1088 21.2143C13.4998 21.2613 10.8878 21.2643 8.27979 21.2093C6.96079 21.1823 6.13779 20.3783 5.99079 19.0473C5.67379 16.1853 5.13379 9.46826 5.13379 9.46826" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path d="M20.708 6.23975H3.75" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path></svg>
                          </button>
                    </div>`;
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
                case "View":
                    HandlePreview(data?.id);
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

    const GetMailConfig = async () => {
        try {
            const res = await axios.get(`${api}email-config`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data.status) {
                setMailHost(res.data.data?.mail_host)
                setMailPort(res.data.data?.mail_port)
                setMailUsername(res.data.data?.mail_username)
                setMailPassword(res.data.data?.mail_password)
                setMailEncryption(res.data.data?.mail_encryption)
                setMailFromAddress(res.data.data?.mail_from_address)
                setMailFromName(res.data.data?.mail_from_name)
            }
        } catch (err) {
            // console.log(err);
        }
    };
    const GetTemplate = async () => {
        try {
            const res = await axios.get(`${api}email-templates/${UserData?.id}`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            setTemplates(res.data.templates)
        } catch (err) {
            // console.log(err);
        }
    };
    useEffect(() => {
        GetMailConfig()
        GetTemplate()
    }, []);
    const HandleMailConfig = async () => {
        try {
            const res = await axios.post(`${api}email-config`, {
                mail_driver: mailDriver,
                mail_host: mailHost,
                mail_port: mailPort,
                mail_username: mailUsername,
                mail_password: mailPassword,
                mail_encryption: mailEncryption,
                mail_from_address: mailFromAddress,
                mail_from_name: mailFromName,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            }
            );
            if (res.data.status) {
                successAlert('Success', 'Email Configuration Stored Successfully');
            }
        } catch (err) {
            // console.log(err);
        }
    };




    //template
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [mailBody, setMailBody] = useState('')
    const [editState, setEditState] = useState('')
    const [templateId, setTemplateId] = useState('')
    const [templatePreview, setTemplatePreview] = useState('')
    const [preview, setPreview] = useState(false);
    const [error, setError] = useState(null);
    const HandleSubmit = async () => {
        try {
            let url = editState ? `${api}update-templates` : `${api}store-templates`;
            const payload = {
                user_id: UserData?.id,
                template_name: name,
                subject,
                body: mailBody
            };
            if (editState) {
                payload.id = templateId;
            }
            const response = await axios.post(url, payload, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (response.data.status) {
                setName('')
                setSubject('')
                setMailBody('')
                GetTemplate()
                handleClose()
            }
        } catch (error) {
            // console.log(error);
        }
    }

    const handleEdit = async (id) => {
        let data = templates?.find((item) => item?.id === id)
        setEditState(true)
        setName(data?.template_id);
        setSubject(data?.subject);
        setMailBody(data?.body);
        setTemplateId(data?.id)
        setShow(true)
    }
    const HandlePreview = (id) => {
        try {
            const template = templates.find((item) => item.id === id);
            if (template) {
                const sanitizedHTML = DOMPurify.sanitize(template.body); // Sanitize the HTML
                setTemplatePreview(sanitizedHTML); // Assuming 'body' contains the HTML string
                setPreview(true);
            } else {
                throw new Error('Template not found');
            }
        } catch (err) {
            setError(err.message);
            setPreview(false);
        }
    };

    const handlePreviewClose = () => {
        setPreview(false);
    }
    return (
        <Row>
            <Modal show={preview} onHide={handlePreviewClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {preview && templatePreview && (
                        // templatePreview
                        <div
                            dangerouslySetInnerHTML={{ __html: templatePreview }}
                        />
                    )}
                    {error && <div className="error">{error}</div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger"
                        onClick={handlePreviewClose}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">{`${editState ? 'Update ' : ' Add New '}`}Template</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col lg="12">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label className="custom-file-input">Name</Form.Label>
                                    <Form.Control type="text" value={name} placeholder="" onChange={(e) => setName(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col lg="12">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label className="custom-file-input">Subject</Form.Label>
                                    <Form.Control type="text" value={subject} placeholder="" onChange={(e) => setSubject(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col lg="12">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label className="custom-file-input">Body</Form.Label>
                                    <JoditEditor
                                        tabIndex={1}
                                        value={mailBody}
                                        onChange={(newContent) => setMailBody(newContent)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger"
                        onClick={handleClose}
                    >
                        Discard Changes
                    </Button>
                    <Button variant="primary" onClick={HandleSubmit}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <Col lg="5">
                <Card>
                    <Card.Header>
                        <h4 className="card-title">Mail Configuration</h4>
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <Row>
                                <Col lg="6">
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label className="custom-file-input">Mailer</Form.Label>
                                        <Form.Control type="text" placeholder="" value={'SMTP'} disabled />
                                    </Form.Group>
                                </Col>
                                <Col lg="6">
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label className="custom-file-input">Mail Host</Form.Label>
                                        <Form.Control type="text" placeholder="" value={mailHost} onChange={e => setMailHost(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col lg="6">
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label className="custom-file-input">Mail Port</Form.Label>
                                        <Form.Control type="text" placeholder="" value={mailPort} onChange={e => setMailPort(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col lg="6">
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label className="custom-file-input">Mail Username</Form.Label>
                                        <Form.Control type="text" placeholder="" value={mailUsername} onChange={e => setMailUsername(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col lg="6">
                                    {/* <Form.Group className="mb-3 form-group">
                                            <Form.Label className="custom-file-input">Mail Password</Form.Label>
                                            <Form.Control type="text" placeholder="" value={mailPassword} onChange={e => setMailPassword(e.target.value)} />
                                        </Form.Group> */}
                                    <Form.Label className="custom-file-input">Mail Password</Form.Label>
                                    <InputGroup className="mb-3">
                                        <Form.Control autoComplete="new-password" name="new-password-field" type={passwordShow ? 'text' : 'password'} placeholder="" value={mailPassword} onChange={e => setMailPassword(e.target.value)} />
                                        <InputGroup.Text>
                                            {
                                                passwordShow ?
                                                    <div className="icon" onClick={() => setPasswordShow(!passwordShow)}>
                                                        <EyeClosedIcon/>
                                                    </div>
                                                    :
                                                    <div className="icon" onClick={() => setPasswordShow(!passwordShow)}>
                                                         <Eye/>
                                                    </div>
                                            }
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Col>
                                <Col lg="6">
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label className="custom-file-input">Mail From Name</Form.Label>
                                        <Form.Control type="text" placeholder="" value={mailFromName} onChange={e => setMailFromName(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col lg="6">
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label className="custom-file-input">Mail From Email</Form.Label>
                                        <Form.Control type="text" placeholder="" value={mailFromAddress} onChange={e => setMailFromAddress(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col lg="6">
                                    <Form.Label className="custom-file-input">Mail Encryption</Form.Label>
                                    <Row>
                                        <Col lg="6" className='d-flex gap-3'>
                                            <div className="form-radio form-check">
                                                <Form.Check.Input
                                                    type="radio"
                                                    id="customRadio8"
                                                    name="payment"
                                                    className="me-2"
                                                    checked={mailEncryption === 'ssl' && true}
                                                    value={'ssl'}
                                                    onChange={(e) => setMailEncryption(e.target.value)}
                                                />
                                                <Form.Label
                                                    className="custom-control-label"
                                                    htmlFor="customRadio8"
                                                >
                                                    {" "}
                                                    SSL
                                                </Form.Label>
                                            </div>
                                            <div className="form-radio form-check">
                                                <Form.Check.Input
                                                    type="radio"
                                                    id="customRadio8"
                                                    name="payment"
                                                    className="me-2"
                                                    value={'tls'}
                                                    checked={mailEncryption === 'tls' && true}
                                                    onChange={(e) => setMailEncryption(e.target.value)}
                                                />
                                                <Form.Label
                                                    className="custom-control-label"
                                                    htmlFor="customRadio8"
                                                >
                                                    {" "}
                                                    TLS
                                                </Form.Label>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <div className='d-flex justify-content-end'>
                                    <Button type="button" className=""
                                        onClick={() => HandleMailConfig()}
                                    >Submit</Button>
                                </div>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg="7">
                <Card>
                    <Card.Header>
                        <div className='d-flex justify-content-between'>
                            <h4 className="card-title">Mail Templates</h4>
                            <div className='d-flex justify-content-end'>
                                <Button type="button" className=""
                                    onClick={() => handleShow()}
                                >New</Button>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <table
                            ref={tableRef}
                            className="table dataTable"
                            data-toggle="data-table"
                        ></table>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
})

export default MailSetting
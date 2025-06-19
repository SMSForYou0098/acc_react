import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { Card, Col, Row, Form, Button, Badge, Modal } from 'react-bootstrap'
import axios from 'axios';
import Select from 'react-select';
import { useMyContext } from '../../../../Context/MyContextProvider';

import useDataTable from '../../../../components/hooks/useDatatable';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Swal from 'sweetalert2';
import SytemVariables from './SytemVariables';
const WhatsAppConfig = () => {
    const { api, successAlert, UserData, authToken, ErrorAlert, showLoading,SystemVars } = useMyContext();
    const [customShow, setCustomShow] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [template, setTemplate] = useState('');
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [badges, setBadges] = useState([]);
    const [configData, setConfigData] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [previewData, setPreviewData] = useState();

    // make usestate show
    const [show, setShow] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [editState, setEditState] = useState(false);
    const [editID, setEditID] = useState('');
    const [number, setNumber] = useState('');

    const handleShow = () => setShow(true);
    const options = SystemVars.map((item) => ({
        value: item.key,
        label: `${item.value} : (${item.key})`,
    }));

    ///sms config
    const GetWhatsAppConfig = async () => {
        try {
            const res = await axios.get(`${api}whatsapp-config-show/${UserData?.id}`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data.status) {
                const configData = res.data?.data;
                setApiKey(configData?.api_key || '');
            }
        } catch (err) {
            console.log(err);
        }
    };
    const GetWhatsAppApis = async () => {
        try {
            const res = await axios.get(`${api}whatsapp-api-show/${UserData?.id}`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data.status) {
                const configData = res.data?.data;
                setConfigData(configData);
                return configData;
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        GetWhatsAppConfig()
        GetWhatsAppApis()
    }, []);



    const HandleConfig = async () => {
        try {
            const payload = { user_id: UserData?.id, api_key: apiKey };
            let apiUrl = `${api}whatsapp-config-store/${UserData?.id}`
            const res = await axios.post(apiUrl, payload, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data.status) {
                successAlert('Configuration saved successfully')
            }
        } catch (error) {
            console.log(error);
        }
    }

    const moveBadge = (draggedIndex, hoveredIndex) => {
        const updatedBadges = [...badges];
        const draggedBadge = updatedBadges[draggedIndex];
        updatedBadges.splice(draggedIndex, 1);
        updatedBadges.splice(hoveredIndex, 0, draggedBadge);
        setBadges(updatedBadges);
    };
    const handleSelectChange = (selectedOption) => {
        if (selectedOption) {
            setBadges((prev) => [...prev, selectedOption?.value]);
        }
    };

    const handleEdit = async (id) => {
        const apiData = await GetWhatsAppApis()
        const data = apiData?.find(data => data?.id === id)
        setEditState(true);
        setEditID(data?.id);
        const vars = data?.variables ? data?.variables : []
        setBadges(vars);
        setTemplate(data?.template_name);
        setCustomShow(data?.custom === 1 ? true : false);
        setTitle(data?.title);
        setUrl(data?.url);
        setShow(true)
    }
    const handleClosePreview = () => {
        setPreviewData()
        setShowPreview(false)
    }
    const handleClose = () => {
        setTitle('');
        setCustomShow(false);
        setTemplate('');
        setUrl('');
        setBadges([]);
        setShow(false)
    };

    const columns = [
        { data: "title", title: "Title" },
        { data: "template_name", title: "Template" },
        {
            data: null,
            orderable: false,
            searchable: false,
            title: "Action",
            render: function (data) {
                return `<div class="flex align-items-center list-user-action">
                          <button class="btn btn-sm btn-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit" data-id=${data?.id} data-method="Edit" data-table="action">
                             <svg fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-20" width="20" height="32" viewBox="0 0 24 24"><path d="M11.4925 2.78906H7.75349C4.67849 2.78906 2.75049 4.96606 2.75049 8.04806V16.3621C2.75049 19.4441 4.66949 21.6211 7.75349 21.6211H16.5775C19.6625 21.6211 21.5815 19.4441 21.5815 16.3621V12.3341" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path fillRule="evenodd" clipRule="evenodd" d="M8.82812 10.921L16.3011 3.44799C17.2321 2.51799 18.7411 2.51799 19.6721 3.44799L20.8891 4.66499C21.8201 5.59599 21.8201 7.10599 20.8891 8.03599L13.3801 15.545C12.9731 15.952 12.4211 16.181 11.8451 16.181H8.09912L8.19312 12.401C8.20712 11.845 8.43412 11.315 8.82812 10.921Z" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path d="M15.1655 4.60254L19.7315 9.16854" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path></svg>
                          </button>
                          <button class="btn btn-sm btn-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="View" data-id=${data?.id} data-method="View" data-table="action">
                             <svg fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M15.1614 12.0531C15.1614 13.7991 13.7454 15.2141 11.9994 15.2141C10.2534 15.2141 8.83838 13.7991 8.83838 12.0531C8.83838 10.3061 10.2534 8.89111 11.9994 8.89111C13.7454 8.89111 15.1614 10.3061 15.1614 12.0531Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.998 19.355C15.806 19.355 19.289 16.617 21.25 12.053C19.289 7.48898 15.806 4.75098 11.998 4.75098H12.002C8.194 4.75098 4.711 7.48898 2.75 12.053C4.711 16.617 8.194 19.355 12.002 19.355H11.998Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button class="btn btn-sm btn-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete" data-id=${data?.id} data-method="Delete" data-table="action">
                             <svg fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-20" width="20" height="32" viewBox="0 0 24 24"><path d="M19.3248 9.46826C19.3248 9.46826 18.7818 16.2033 18.4668 19.0403C18.3168 20.3953 17.4798 21.1893 16.1088 21.2143C13.4998 21.2613 10.8878 21.2643 8.27979 21.2093C6.96079 21.1823 6.13779 20.3783 5.99079 19.0473C5.67379 16.1853 5.13379 9.46826 5.13379 9.46826" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path d="M20.708 6.23975H3.75" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path></svg>
                          </button>
                    </div>`;
            },
        },
    ];
    const tableRef = useRef(null);
    const actionCallback = useCallback((data) => {
        switch (data.method) {
            case "Edit":
                handleEdit(data?.id)
                break;
            case "View":
                HandleShowPreview(data?.id)
                break;
            case "Delete":
                HandleDelete(data?.id);
                break;
            default:
                break;
        }
    }, []);
    useDataTable({
        tableRef: tableRef,
        columns: columns,
        data: configData,
        actionCallback
    });


    const BadgeItem = ({ badge, index }) => {
        const [, drag] = useDrag({
            type: 'BADGE',
            item: { index },
        });

        const [, drop] = useDrop({
            accept: 'BADGE',
            hover: (item) => {
                if (item.index !== index) {
                    moveBadge(item.index, index);
                    item.index = index;
                }
            },
        });

        return (
            <div ref={(node) => drag(drop(node))} className="custom-dotted-border rounded-2 d-flex p-1">
                <Badge bg="secondary" className="rounded-pill border me-1 d-flex align-items-center" style={{ cursor: 'default' }}>
                    {index + 1}
                </Badge>
                <Badge bg="info" className="d-flex align-items-center" style={{ paddingRight: '8px', cursor: 'pointer' }}>
                    {badge}
                </Badge>
                <span
                    style={{ marginLeft: '4px', cursor: 'pointer' }}
                    onClick={() => setBadges(badges.filter((_, i) => i !== index))}
                >
                    &times;
                </span>
            </div>
        );
    };

    const HandleSubmit = async () => {
        try {
            const payload = {
                title,
                user_id: UserData?.id,
                template_name: template,
                custom: customShow ? 1 : 0,
                url,
                variables: badges
            };
            let apiUrl = editState ? `${api}whatsapp-api-update/${editID}` : `${api}whatsapp-api-store`;
            const response = await axios.post(apiUrl, payload, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (response.data.status) {
                handleClose()
                GetWhatsAppApis()
                successAlert(response.data?.message)
            }
        } catch (error) {
            console.log(error);
        }
    }

    // alert before delete  sweet alert
    const HandleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${api}whatsapp-api-destroy/${id}`);
                    if (response.data.status) {
                        handleClose();
                        GetWhatsAppApis();
                        successAlert('Deleted successfully');
                    }
                } catch (error) {
                    ErrorAlert('Error deleting item:', error);
                }
            }
        });
    };
    const HandleShowPreview = async (id) => {
        const apiData = await GetWhatsAppApis()
        if (id) {
            const data = apiData?.find(data => data?.id === id)
            setBadges(data?.variables)
            setPreviewData(data)
            setShowPreview(true)
        }
    }
    const [dynamicFields, setDynamicFields] = useState({});
    const GenratePreview = () => {
        let isCustom = previewData?.custom === 1
        if (isCustom) {
            return previewData?.url
        } else {
            let validNumber = validateNumber(number);
            let api = `https://waba.smsforyou.biz/api/send-messages?apikey=*${apiKey}*&to=*${validNumber ? validNumber : ':NUMBER'}*& type=T&tname=*${previewData?.template_name}*&values=*${badges?.join(',')}*&media_url=:IMAGE`
            const formattedApi = boldifyText(api);
            return formattedApi;

        }
    }
    const validateNumber = (number) => {
        const regex = /^\d{10,12}$/;
        if (regex.test(number)) {
            return number;
        }
        return '';
    };

    const boldifyText = (text) => {
        const regex = /\*(.*?)\*/g;
        return text.replace(regex, (match, p1) => `<b>${p1}</b>`);
    };

    const HandleSendMessage = async (key) => {
        if (!number || !validateNumber(number)) {
            ErrorAlert('Please enter a valid mobile number (10 or 12 digits).');
            return;
        }

        if (previewData?.custom !== 1 && badges?.length > 0) {
            for (const item of badges) {
                if (!dynamicFields[item]) {
                    ErrorAlert(`Please enter a value for ${getByLabelText(item)}.`);
                    return;
                }
            }
        }
        let values = Object.values(dynamicFields);
        
        let image = `https://smsforyou.biz/wp-content/uploads/2023/10/smsforyou.png`;
        let api = `https://waba.smsforyou.biz/api/send-messages?apikey=${apiKey}&to=${number}&type=T&tname=${previewData?.template_name}&values=${values?.join(',')}&media_url=${image}`
        const loader = showLoading('Sending Message');
        try {
            await axios.post(api);
            loader.close();
            successAlert('Message sent successfully');
        } catch (error) {
            loader.close();
            ErrorAlert('Error sending message:', error);
        }
    }
    const getByLabelText = (key) => {
        const value = SystemVars?.find((tt) => tt?.key === key)
        return value?.value
    }
    const formattedApi = GenratePreview();
    return (
        <DndProvider backend={HTML5Backend}>
            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">{`${editState ? 'Update ' : ' Add New '}`} Configuration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col lg="12" className='d-flex justify-content-end'>
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
                        </Col>
                        {!editState &&
                            <Col lg="6">
                                <Form.Group controlId="templateTitle" className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        }
                        <Col lg="6">
                            <Form.Group controlId="templateName" className="mb-3">
                                <Form.Label>Template Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter template name"
                                    value={template}
                                    onChange={(e) => setTemplate(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
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
                                        <Form.Label style={{ fontSize: '0.8rem' }} className="custom-file-input me-3">&bull; <strong>Note : </strong> - Use system variables for dynamic content</Form.Label>
                                    </Form.Group>
                                </Col>
                            </>
                            :
                            <Col lg="12">
                                <Form.Group className="mb-3">
                                    <Form.Label>Variables</Form.Label>
                                    <div
                                        className={`d-flex flex-column flex-wrap ${badges?.length > 0 && 'p-2 gap-2'} rounded`}
                                        style={{ border: '1px solid #e6ebf1' }}
                                    >
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {badges?.map((badge, index) => (
                                                <BadgeItem key={index} badge={badge} index={index} />
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
                        }
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={HandleSubmit}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showPreview} onHide={handleClosePreview} size='lg'>
                <Modal.Header closeButton>Api Preview</Modal.Header>
                <Modal.Body>
                    <Row>

                        <Col lg="12">
                            <Form.Group controlId="templateTitle" className="mb-3">
                                <Form.Label>Preview</Form.Label>
                                <div
                                    className="preview-content"
                                    dangerouslySetInnerHTML={{ __html: formattedApi }}
                                    style={{
                                        maxHeight: '200px',
                                        padding: '10px',
                                        backgroundColor: '#f8f9fa',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        wordBreak: 'break-word',
                                        whiteSpace: 'pre-wrap',
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <hr />
                        <h5 className='mb-2'>Demo Test</h5>
                        <Col lg="12">
                            <Form.Group controlId="templateTitle" className="mb-3">
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={`Enter Number`}
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        {(previewData?.custom !== 1 && badges?.length > 0) &&
                            badges?.map((item, i) => (
                                <Col lg="6">
                                    <Form.Group controlId="templateTitle" className="mb-3">
                                        <Form.Label>Enter {getByLabelText(item)}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={`Enter ${getByLabelText(item)}`}
                                            onChange={(e) =>
                                                setDynamicFields((prev) => ({ ...prev, [item]: e.target.value }))
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            ))
                        }
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={HandleSendMessage}>
                        Send Message
                    </Button>
                </Modal.Footer>
            </Modal>
            <Row>
                <Col lg="6">
                    <Row>
                        <Col lg="12">
                            <Card>
                                <Card.Header>
                                    <div className='d-flex justify-content-between'>
                                        <h4 className="card-title">WhatsApp Config Settings</h4>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <Form>
                                        <Row>
                                            <Col lg="10">
                                                <Form.Group className="mb-3 form-group">
                                                    <Form.Label className="custom-file-input">API Key</Form.Label>
                                                    <Form.Control type="text" placeholder="" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <div className='d-flex align-items-end justify-content-end'>
                                            <Button type="button" onClick={() => HandleConfig()}>Submit</Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg="12">
                            <Row>
                                <SytemVariables />
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col lg="6">
                    <Row>
                        <Col lg="12">
                            <Card>
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <h4 className="card-title">WhatsApp Configs</h4>
                                    <Button variant="primary" onClick={handleShow}>
                                        New Config
                                    </Button>
                                </Card.Header>
                                <Card.Body className="table-fixed">
                                    <table
                                        ref={tableRef}
                                        className="table dataTable"
                                        data-toggle="data-table"
                                    ></table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </DndProvider>
    )
}

export default WhatsAppConfig
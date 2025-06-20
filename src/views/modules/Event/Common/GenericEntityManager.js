import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import axios from 'axios';
import { useMyContext } from '../../../../Context/MyContextProvider';
import Swal from 'sweetalert2';
import { Edit, Trash2 } from 'lucide-react';
import { CustomTooltip } from '../CustomUtils/CustomTooltip';
import CustomDataTable from '../CustomHooks/CustomDataTable';

const GenericEntityManager = ({ 
    entityName, 
    entityNamePlural, 
    apiEndpoint, 
    formFields = [], 
    extraFormData = {}, 
    cardSize = 6 
}) => {
    const { api, successAlert, authToken, ErrorAlert, UserData } = useMyContext();
    const [pageList, setPageList] = useState();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [modalState, setModalState] = useState({
        show: false,
        editState: false,
        editId: '',
        isLoading: false
    });

    // Initialize form data from form fields configuration
    useEffect(() => {
        const initialFormData = {};
        formFields.forEach(field => {
            initialFormData[field.name] = field.type === 'checkbox' ? false : '';
        });
        setFormData(initialFormData);
    }, [formFields]);

    const handleEdit = useCallback(async (id) => {
        try {
            const data = pageList?.find((item) => item?.id === id);
            if (!data) {
                throw new Error(`${entityName} not found`);
            }

            const updatedFormData = {};
            formFields.forEach(field => {
                if (field.type === 'checkbox') {
                    updatedFormData[field.name] = data[field.name] === 1;
                } else {
                    updatedFormData[field.name] = data[field.name] || '';
                }
            });

            setFormData(updatedFormData);

            setModalState(prev => ({
                ...prev,
                editState: true,
                editId: data?.id,
                show: true
            }));
        } catch (error) {
            const err = error.response?.data?.message || error.response?.data?.error || `Failed to edit ${entityName.toLowerCase()}`;
            ErrorAlert(err);
        }
    }, [pageList, ErrorAlert, entityName, formFields]);

    const fetchEntities = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${api}${apiEndpoint}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            });
            if (response.data.status) {
                setPageList(response.data.data);
            } else{
                setPageList([]);
            }
        } catch (error) {
            const err = error.response?.data?.message || error.response?.data?.error || `Failed to fetch ${entityNamePlural.toLowerCase()}`;
            ErrorAlert(err);
        } finally {
            setLoading(false);
        }
    }, [api, authToken, ErrorAlert, apiEndpoint, entityNamePlural]);

    // Use effect with optimized dependency
    useEffect(() => {
        fetchEntities();
    }, [fetchEntities]);

    const handleClose = useCallback(() => {
        setModalState(prev => ({
            ...prev,
            show: false,
            editState: false,
            editId: '',
            isLoading: false,
        }));
        
        const initialFormData = {};
        formFields.forEach(field => {
            initialFormData[field.name] = field.type === 'checkbox' ? false : '';
        });
        setFormData(initialFormData);
    }, [formFields]);

    const handleDelete = useCallback(async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                    try {
                        const response = await axios.delete(`${api}${apiEndpoint}-destroy/${id}`, {
                            headers: {
                                'Authorization': `Bearer ${authToken}`,
                            }
                        });
                        if (!response.data.status) {
                            throw new Error(response.data.message || `Failed to delete ${entityName.toLowerCase()}`);
                        }
                        return response.data;
                    } catch (error) {
                        Swal.showValidationMessage(error.message);
                    }
                },
                allowOutsideClick: () => !Swal.isLoading()
            });

            if (result.isConfirmed) {
                await fetchEntities();
                successAlert(`${entityName} deleted successfully`);
            }
        } catch (error) {
            console.error(`Error deleting ${entityName.toLowerCase()}:`, error);
            ErrorAlert(`Failed to delete ${entityName.toLowerCase()}`);
        }
    }, [api, authToken, fetchEntities, successAlert, ErrorAlert, apiEndpoint, entityName]);

    const validateForm = useCallback(() => {
        for (const field of formFields) {
            if (field.required && !formData[field.name]) {
                ErrorAlert(`${field.label} is required`);
                return false;
            }
        }
        return true;
    }, [formData, ErrorAlert, formFields]);

    const handleSubmit = useCallback(async () => {
        try {
            setModalState(prev => ({ ...prev, isLoading: true }));

            if (!validateForm()) {
                setModalState(prev => ({ ...prev, isLoading: false }));
                return;
            }

            let formPayload = { ...formData, userId: UserData.id, ...extraFormData }
            
            const apiUrl = modalState.editState
                ? `${api}${apiEndpoint}-update/${modalState.editId}`
                : `${api}${apiEndpoint}-store`;

            const response = await axios.post(apiUrl, formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`,
                }
            });

            if (response.data.status) {
                await fetchEntities();
                handleClose();
                successAlert(response.data?.message || `${entityName} ${modalState.editState ? 'updated' : 'created'} successfully`);
            }
        } catch (error) {
            console.error(`Error submitting ${entityName.toLowerCase()}:`, error);
            ErrorAlert(error.message || `Failed to save ${entityName.toLowerCase()}`);
        } finally {
            setModalState(prev => ({ ...prev, isLoading: false }));
        }
    }, [formData, modalState.editState, modalState.editId, api, apiEndpoint, authToken, fetchEntities, successAlert, ErrorAlert, validateForm, handleClose, UserData.id, entityName, extraFormData]);

    const columns = useMemo(() => [
        {
            dataField: 'id',
            text: '#',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
            sort: true
        },
        {
            dataField: 'title',
            text: entityName,
            sort: true
        },
        {
            dataField: 'action',
            text: 'Action',
            formatter: (cell, row) => {
                const actions = [
                    {
                        tooltip: `Edit ${entityName}`,
                        onClick: () => handleEdit(row.id),
                        variant: "primary",
                        icon: <Edit size={16} />
                    },
                    {
                        tooltip: `Delete ${entityName}`,
                        onClick: () => handleDelete(row.id),
                        variant: "danger",
                        icon: <Trash2 size={16} />
                    }
                ];

                return (
                    <div className="d-flex gap-2 justify-content-center">
                        {actions.map((action, index) => (
                            <CustomTooltip
                                key={index}
                                text={action.tooltip}
                            >
                                <Button
                                    variant={action.variant}
                                    className="btn-sm btn-icon"
                                    onClick={action.onClick}
                                >
                                    {action.icon}
                                </Button>
                            </CustomTooltip>
                        ))}
                    </div>
                );
            },
            headerAlign: 'center',
            align: 'center'
        }
    ], [handleEdit, handleDelete, entityName]);

    const handleShow = useCallback(() => {
        setModalState(prev => ({
            ...prev,
            show: true
        }));
    }, []);

    const handleFormChange = useCallback((fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    }, []);

    return (
        <Row>
            <Modal
                show={modalState.show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title className="text-center w-100">
                        {modalState.editState ? 'Edit' : 'New'} {entityName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            {formFields.map((field, index) => (
                                <Col lg="12" key={index}>
                                    <Form.Group className="mb-3 form-group">
                                        {field.type === 'checkbox' ? (
                                            <Form.Check
                                                type="switch"
                                                id={`${field.name}-switch`}
                                                label={field.label}
                                                checked={formData[field.name] || false}
                                                onChange={(e) => handleFormChange(field.name, e.target.checked)}
                                            />
                                        ) : (
                                            <>
                                                <Form.Label>{field.label}</Form.Label>
                                                <Form.Control
                                                    type={field.type || "text"}
                                                    value={formData[field.name] || ''}
                                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                                    onChange={(e) => handleFormChange(field.name, e.target.value)}
                                                />
                                            </>
                                        )}
                                    </Form.Group>
                                </Col>
                            ))}
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={handleClose}
                        disabled={modalState.isLoading}
                    >
                        Discard Changes
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={modalState.isLoading}
                    >
                        {modalState.isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                Saving...
                            </>
                        ) : 'Save'}
                    </Button>
                </Modal.Footer>
            </Modal>
            <Col lg={cardSize}>
                <Card>
                    <Card.Header className="d-flex justify-content-between">
                        <div className="header-title">
                            <h4 className="card-title">{entityNamePlural}</h4>
                        </div>
                        <div className="button">
                            <h4 className="card-title">
                                <Button
                                    className="me-4 hvr-curl-top-right border-0"
                                    onClick={handleShow}
                                >
                                    Add New {entityName}
                                </Button>
                            </h4>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <CustomDataTable
                            data={pageList}
                            columns={columns}
                            loading={loading}
                            keyField="id"
                            searchPlaceholder={`Search ${entityNamePlural.toLowerCase()}...`}
                        />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default GenericEntityManager;
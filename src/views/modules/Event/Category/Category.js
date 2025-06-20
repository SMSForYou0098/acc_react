import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import axios from 'axios';
import { useMyContext } from '../../../../Context/MyContextProvider';
import Swal from 'sweetalert2';
import AssignFields from './AssignFields';
// import SelectedOptionView from '../Attendee/Fields/SelectedOptionView';
import { EditIcon } from '../CustomHooks/CustomIcon';
import { Check, Edit, Trash2, X } from 'lucide-react';
import { CustomTooltip } from '../CustomUtils/CustomTooltip';
import CustomDataTable from '../CustomHooks/CustomDataTable';
// import CustomDataTable from '../Wallet/CustomDataTable';

const Category = () => {
    const { api, successAlert, authToken, ErrorAlert,UserData } = useMyContext();
    const [pageList, setPageList] = useState();
    const [loading, setLoading] = useState(true);
    console.log('userData',UserData)
    const [formData, setFormData] = useState({
        title: '',
        description:'',
        // image: null,
        // attendyRequired: false,
        // photoRequired: false,
        // status: true
    });
    const [modalState, setModalState] = useState({
        show: false,
        editState: false,
        editId: '',
        isLoading: false
    });
    const [fieldsState, setFieldsState] = useState({
        showFields: false,
        fieldsName: [],
        ids: []
    });

    const handleEdit = useCallback(async (id) => {
        try {
            const data = pageList?.find((item) => item?.id === id);
            if (!data) {
                throw new Error('Category not found');
            }

            setFormData({
                title: data?.title || '',
                image: data?.image || null,
                attendyRequired: data?.attendy_required === 1,
                photoRequired: data?.photo_required === 1,
                status: data?.status === 1
            });

            setModalState(prev => ({
                ...prev,
                editState: true,
                editId: data?.id,
                show: true
            }));

            const customFieldsArray = data?.catrgotyhas_field?.custom_fields_id?.split(',')?.map(Number);
            setFieldsState({
                ids: customFieldsArray,
                fieldsName: data?.fields || [],
                showFields: false
            });
        } catch (error) {
            console.error('Error editing category:', error);
            ErrorAlert('Failed to edit category');
        }
    }, [pageList, ErrorAlert]);


    const GetCategories = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${api}category`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            });
            if (response.data.status) {
                setPageList(response.data.categoryData);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            ErrorAlert('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    }, [api, authToken, ErrorAlert]);

    // Use effect with optimized dependency
    useEffect(() => {
        GetCategories();
    }, [GetCategories]);

    const handleClose = useCallback(() => {
        setModalState(prev => ({
            ...prev,
            show: false,
            editState: false,
            editId: '',
            isLoading: false,
            showFields: false
        }));
        setFormData({
            title: '',
            image: null,
            attendyRequired: false,
            photoRequired: false,
            status: true
        });
        setFieldsState({
            showFields: false,
            fieldsName: [],
            ids: []
        });
    }, []);

    const HandleDelete = useCallback(async (id) => {
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
                        const response = await axios.delete(`${api}category-destroy/${id}`, {
                            headers: {
                                'Authorization': `Bearer ${authToken}`,
                            }
                        });
                        if (!response.data.status) {
                            throw new Error(response.data.message || 'Failed to delete category');
                        }
                        return response.data;
                    } catch (error) {
                        Swal.showValidationMessage(error.message);
                    }
                },
                allowOutsideClick: () => !Swal.isLoading()
            });

            if (result.isConfirmed) {
                await GetCategories();
                successAlert('Category deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            ErrorAlert('Failed to delete category');
        }
    }, [api, authToken, GetCategories, successAlert, ErrorAlert]);

    const validateForm = useCallback(() => {
        if (!formData.title.trim()) {
            ErrorAlert('Title is required');
            return false;
        }
        return true;
    }, [formData.title, ErrorAlert]);

    const AttachFields = useCallback(async (id) => {
        try {
            const response = await axios.post(`${api}catrgoty-fields-store`, {
                category_id: id,
                custom_fields_id: fieldsState.ids || [],
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            });

            if (response.data.status) {
                successAlert('Success', 'Fields attached successfully');
                setFieldsState(prev => ({
                    ...prev,
                    fieldsName: [],
                    ids: []
                }));
                await GetCategories();
            }
        } catch (error) {
            console.error('Error attaching fields:', error);
            ErrorAlert('Failed to attach fields');
        }
    }, [api, authToken, fieldsState.ids, GetCategories, successAlert, ErrorAlert]);

    const HandleSubmit = useCallback(async () => {
        try {
            setModalState(prev => ({ ...prev, isLoading: true }));

            // Add validateForm check here
            if (!validateForm()) {
                return;
            }

            let formPayload = {...formData,userId:UserData.id}
            console.log('formData',formPayload)

            const apiUrl = modalState.editState
                ? `${api}category-update/${modalState.editId}`
                : `${api}category-store`;

            const response = await axios.post(apiUrl, formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`,
                }
            });

            if (response.data.status) {
                await AttachFields(response.data?.categoryData?.id);
                await GetCategories();
                handleClose();
                successAlert(response.data?.message);
            }
        } catch (error) {
            console.error('Error submitting category:', error);
            ErrorAlert(error.message || 'Failed to save category');
        } finally {
            setModalState(prev => ({ ...prev, isLoading: false }));
        }
    }, [formData, modalState.editState, modalState.editId, api, authToken, AttachFields, GetCategories, successAlert, ErrorAlert, validateForm, handleClose]); // Add validateForm to dependencies

    const columns = useMemo(() => [
        {
            dataField: 'id',
            text: '#',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
            // headerAlign: 'center',
            // align: 'center',
            sort: true
        },
        {
            dataField: 'title',
            text: 'Category',
            // headerAlign: 'center',
            // align: 'center',
            sort: true
        },
        {
            dataField: 'attendy_required',
            text: 'Attendee Details Required',
            formatter: (cell) => (
                <div className="d-flex justify-content-center">
                    {cell === 1 ? (
                        <Check size={18} className="text-success" />
                    ) : (
                        <X size={18} className="text-danger" />
                    )}
                </div>
            ),
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'photo_required',
            text: 'Photo Required',
            formatter: (cell) => (
                <div className="d-flex justify-content-center">
                    {cell === 1 ? (
                        <Check size={18} className="text-success" />
                    ) : (
                        <X size={18} className="text-danger" />
                    )}
                </div>
            ),
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'action',
            text: 'Action',
            formatter: (cell, row) => {
                const actions = [
                    {
                        tooltip: "Edit Category",
                        onClick: () => handleEdit(row.id),
                        variant: "primary",
                        icon: <Edit size={16} />
                    },
                    {
                        tooltip: "Delete Category",
                        onClick: () => HandleDelete(row.id),
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
    ], [handleEdit, HandleDelete]);

    const handleShow = useCallback(() => {
        setModalState(prev => ({
            ...prev,
            show: true
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
                        {modalState.editState ? 'Edit' : 'New'} Category
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col lg="12">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.title}
                                        placeholder="Enter title"
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            title: e.target.value
                                        }))}
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg="12">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.description}
                                        placeholder="Enter Description"
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            description: e.target.value
                                        }))}
                                    />
                                </Form.Group>
                            </Col>

                            {/* <Col lg="12">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Attendee Required</Form.Label>
                                    <Form.Check
                                        type="switch"
                                        id="attendy-required-switch"
                                        checked={formData.attendyRequired}
                                        onChange={(e) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                attendyRequired: e.target.checked
                                            }));
                                            if (e.target.checked) {
                                                setFieldsState(prev => ({
                                                    ...prev,
                                                    showFields: true
                                                }));
                                            }
                                        }}
                                    />
                                </Form.Group>
                            </Col> */}
                            {/* <Col lg="4">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Photo Required</Form.Label>
                                    <Form.Check
                                        type="switch"
                                        id="photo-required-switch"
                                        checked={formData.photoRequired}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            photoRequired: e.target.checked
                                        }))}
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg="4">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Check
                                        type="switch"
                                        id="status"
                                        checked={formData.status}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            status: e.target.checked
                                        }))}
                                    />
                                </Form.Group>
                            </Col> */}
                        </Row>
                    </Form>
                    {formData.attendyRequired && (
                        <Col lg="12">
                            <div className="d-flex justify-content-between">
                                <p className='mb-2'>Attendee Fields: </p>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => setFieldsState(prev => ({
                                        ...prev,
                                        showFields: true
                                    }))}
                                >
                                    <EditIcon />
                                </div>
                            </div>
                            {/* <div className='custom-dotted-border p-3'>
                                <Row>
                                    {fieldsState.fieldsName?.map((field, i) => (
                                        <Col key={i} md={4} className="mb-2">
                                            <SelectedOptionView item={field.field_name} />
                                        </Col>
                                    ))}
                                </Row>
                            </div> */}
                        </Col>
                    )}
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
                        onClick={HandleSubmit}
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
            <AssignFields
                editState={modalState.editState}
                showFields={fieldsState.showFields}
                onClose={() => setFieldsState(prev => ({ ...prev, showFields: false }))}
                onFieldsChange={(ids) => setFieldsState(prev => ({ ...prev, ids }))}
                selectedIds={fieldsState.ids}
                onFieldsNameChange={(fields) => setFieldsState(prev => ({ ...prev, fieldsName: fields }))}
            />
            <Col lg="12">
                <Card>
                    <Card.Header className="d-flex justify-content-between">
                        <div className="header-title">
                            <h4 className="card-title">Catogories</h4>
                        </div>
                        <div className="button">
                            <h4 className="card-title">
                                <Button
                                    className="me-4 hvr-curl-top-right border-0"
                                    onClick={handleShow}
                                >
                                    Add New Category
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
                            searchPlaceholder="Search categories..."
                        />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

Category.displayName = "Category";
export default Category;
import React, { memo, useEffect, useState, useCallback } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import axios from 'axios';
import { useMyContext } from '../../../../Context/MyContextProvider';
import { CustomCheckbox } from '../CustomComponents/CustomFormFields';

const AssignFields = memo(({ 
    showFields, 
    onClose, // renamed from HandleCloseFields for clarity
    editState,
    onFieldsChange, // renamed from getIDs for clarity
    selectedIds = [], // renamed from existingIds for clarity
    onFieldsNameChange // renamed from setFieldsName for clarity
}) => {
    const { api, successAlert, ErrorAlert, authToken } = useMyContext();
    const [fields, setFields] = useState([]);
    const [selectedFields, setSelectedFields] = useState(selectedIds);

    // Fetch available fields
    const fetchFields = useCallback(async () => {
        try {
            const response = await axios.get(`${api}fields-name`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            });
            if (response.data.status) {
                setFields(response.data.customFields);
            }
        } catch (error) {
            console.error('Error fetching fields:', error);
            ErrorAlert('Failed to fetch fields');
        }
    }, [api, authToken, ErrorAlert]);

    useEffect(() => {
        fetchFields();
    }, [fetchFields]);

    // Update selected fields when editing
    useEffect(() => {
        if (editState) {
            setSelectedFields(selectedIds);
        }
    }, [selectedIds, editState]);

    // Handle field selection
    const handleFieldSelection = useCallback((id) => {
        setSelectedFields(prev => {
            const newSelection = prev.includes(id)
                ? prev.filter(existingId => existingId !== id)
                : [...prev, id];
            return newSelection;
        });
    }, []);

    // Get selected fields data
    const getSelectedFieldsData = useCallback(() => {
        const selected = selectedFields
            .map(id => fields.find(field => field.id === id))
            .filter(Boolean);
        return selected;
    }, [fields, selectedFields]);

    // Handle form submission
    const handleSubmit = useCallback(() => {
        const selectedData = getSelectedFieldsData();
        onFieldsNameChange(selectedData);
        onFieldsChange(selectedFields);
        onClose();
        setSelectedFields([]);
        successAlert('Fields updated successfully');
    }, [getSelectedFieldsData, onFieldsNameChange, onFieldsChange, onClose, selectedFields, successAlert]);

    return (
        <Modal show={showFields} onHide={onClose} size='xl' centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-center w-100">
                    {editState ? 'Update' : 'Select'} Fields
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    {fields.map((item) => (
                        <Col md={4} key={item.id}>
                            <Card>
                                <Card.Header className='p-0'>
                                    <label className="inner-set p-2 rounded-3 d-flex gap-3 custom-dotted-border cursor-pointer">
                                        <CustomCheckbox
                                            label={item.field_name}
                                            validationMessage="Checkbox is required"
                                            checked={selectedFields.includes(item.id)}
                                            onChange={() => handleFieldSelection(item.id)}
                                        />
                                    </label>
                                </Card.Header>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    variant="danger"
                    onClick={onClose}
                >
                    Discard Changes
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSubmit}
                >
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

AssignFields.displayName = 'AssignFields';
export default AssignFields;
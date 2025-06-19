import React, { useState } from 'react'
import { Alert, Button, Card, Col, Form, Modal, Table } from 'react-bootstrap'
import { useMyContext } from '../../../../Context/MyContextProvider';
import axios from 'axios';
import { Edit2, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
const SytemVariables = () => {
    const { SystemVars, GetSystemVars, authToken, api } = useMyContext();
    const [showModal, setShowModal] = useState(false);
    const [newVar, setNewVar] = useState({ key: '', value: '' })
    const [error, setError] = useState('');
    const [editId, setEditId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const handleEditClick = (item) => {
        setNewVar({ key: item.key, value: item.value });
        setEditId(item.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!newVar.key.trim() || !newVar.value.trim()) {
            setError('Both key and value are required and cannot be empty');
            return;
        }

        try {
            const url = isEditing
                ? `${api}system-variables-update/${editId}`
                : `${api}system-variables-store`;

            const response = await axios.post(url, newVar, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200 || response.status === 201) {
                setShowModal(false);
                setNewVar({ key: '', value: '' });
                setIsEditing(false);
                setEditId(null);
                await GetSystemVars();
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error saving system variable');
            console.error('Error saving system variable:', error);
        }
    };


    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                const response = await axios.delete(`${api}system-variables-destroy/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    }
                });

                if (response.data?.status) {
                    await GetSystemVars();
                    Swal.fire(
                        'Deleted!',
                        'System variable has been deleted.',
                        'success'
                    );
                } else {
                    Swal.fire(
                        'Error!',
                        error.message || 'Error deleting system variable',
                        'error'
                    );
                }
            }
        } catch (error) {
            Swal.fire(
                'Error!',
                error.message || 'Error deleting system variable',
                'error'
            );
        }
    };

    return (
        <>
            <Modal show={showModal} onHide={() => {
                setShowModal(false);
                setIsEditing(false);
                setEditId(null);
                setNewVar({ key: '', value: '' });
                setError('');
            }}>
                <Modal.Header closeButton>
                {isEditing ? 'Edit ' : 'Add New '}System Variable
                </Modal.Header>
                <Modal.Body>
                    {error && (
                        <Alert variant="danger" className="mb-3">
                            {error}
                        </Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Key</Form.Label>
                            <Form.Control
                                type="text"
                                value={newVar.key}
                                onChange={(e) => setNewVar({ ...newVar, key: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Value</Form.Label>
                            <Form.Control
                                type="text"
                                value={newVar.value}
                                onChange={(e) => setNewVar({ ...newVar, value: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {isEditing ? 'Update ' : 'Save '}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Col lg="12">
                <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <h4 className="card-title">System Variables</h4>
                        <Button variant="primary" onClick={() => setShowModal(true)}>
                            Add New Variable
                        </Button>
                    </Card.Header>
                    <Card.Body className="table-fixed p-0">
                        <div className="table-responsive mt-4">
                            <Table responsive striped className="mb-0" role="grid">
                                <thead>
                                    <tr className="bg-white">
                                        <th scope="col">Key</th>
                                        <th scope="col">Value</th>
                                        <th scope="col" className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {SystemVars?.map((item, index) => (
                                        <tr key={index}>
                                            <td className={index % 2 === 0 ? "" : "text-dark"}>{item?.key}</td>
                                            <td className={index % 2 === 0 ? "" : "text-dark"}>{item?.value}</td>
                                            <td className="text-center">
                                                <Button
                                                    variant="link"
                                                    className="p-0 me-2"
                                                    onClick={() => handleEditClick(item)}
                                                >
                                                    <Edit2 size={16} className="text-primary" />
                                                </Button>
                                                <Button
                                                    variant="link"
                                                    className="p-0"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <Trash2 size={16} className="text-danger" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </>
    )
}

export default SytemVariables

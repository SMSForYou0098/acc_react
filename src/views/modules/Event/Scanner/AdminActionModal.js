import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const AdminActionModal = ({ show, onHide, onActionSelect }) => {
    const actions = [
        { id: 'verify', label: 'Verify Ticket' },
        { id: 'shopkeeper', label: 'Shop Ticket Verification' },
        { id: 'cancel', label: 'Cancel Ticket' },
        // Add more admin actions as needed
    ];

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Select Action</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-grid gap-2">
                    {actions.map((action) => (
                        <Button
                            key={action.id}
                            variant="outline-primary"
                            onClick={() => {
                                onActionSelect(action.id);
                                onHide();
                            }}
                            className="mb-2"
                        >
                            {action.label}
                        </Button>
                    ))}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default AdminActionModal;
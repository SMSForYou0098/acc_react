import React, { useState } from 'react'
import { Button, Modal, Row, Col, Card, Badge } from 'react-bootstrap'
import { Check, X, Layout } from 'lucide-react'

const LayoutSelector = ({ onLayoutSelect, selectedLayout, fileField, onFileReset }) => {
    const [showModal, setShowModal] = useState(false);

    const layouts = [
        {
            id: 'layout1',
            name: '321 x 204px (Standard)',
            description: 'Colour and HoloKote single print area',
            width: 321, // 85mm * 3.78
            height: 204, // 54mm * 3.78
            isMonochrome: false
        },
        {
            id: 'layout2',
            name: '397 x 204px (Wide)',
            description: 'Colour and HoloKote single print area',
            width: 397, // 105mm * 3.78
            height: 204, // 54mm * 3.78
            isMonochrome: false
        },
        {
            id: 'layout3',
            name: '529 x 204px (Extra Wide)',
            description: 'Colour and HoloKote single print area',
            width: 529, // 140mm * 3.78
            height: 204, // 54mm * 3.78
            isMonochrome: false
        },
        {
            id: 'layout4',
            name: '529 x 204px (Monochrome)',
            description: 'Monochrome single print area',
            width: 529, // 140mm * 3.78
            height: 204, // 54mm * 3.78
            isMonochrome: true
        }
    ];

    const handleLayoutSelect = (layoutId) => {
        // Reset file input and related data when layout changes
        if (onFileReset && fileField && selectedLayout !== layoutId) {
            onFileReset(fileField.name);
        }
        onLayoutSelect(layoutId);
    };

    const handleLayoutDoubleClick = (layoutId) => {
        // Reset file input and related data when layout changes
        if (onFileReset && fileField && selectedLayout !== layoutId) {
            onFileReset(fileField.name);
        }
        onLayoutSelect(layoutId);
        setShowModal(false);
    };

    const getSelectedLayoutName = () => {
        const layout = layouts.find(l => l.id === selectedLayout);
        return layout ? layout.name : 'No layout selected';
    };

    return (
        <>
            <div className="mb-3">
                <label className="form-label d-flex align-items-center gap-2">
                    <Layout size={18} />
                    Layout Template
                </label>
                <div className="d-flex align-items-center gap-2">
                    <Button
                        variant={selectedLayout ? "outline-primary" : "primary"}
                        onClick={() => setShowModal(true)}
                        className="flex-grow-1"
                    >
                        {selectedLayout ? `Change Layout: ${getSelectedLayoutName()}` : 'Select Layout Template'}
                    </Button>
                    {selectedLayout && (
                        <Button
                            variant="outline-secondary"
                            onClick={() => {
                                onLayoutSelect(null);
                                // Reset file input and related data if onFileReset is provided
                                if (onFileReset && fileField) {
                                    onFileReset(fileField.name);
                                }
                            }}
                        >
                            <X size={16} />
                        </Button>
                    )}
                </div>
                {selectedLayout && (
                    <small className="text-muted d-block mt-1">
                        Selected: <Badge bg="primary" className="ms-1">{getSelectedLayoutName()}</Badge>
                    </small>
                )}
            </div>

            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="xl"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Select Layout Template</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="p-3 rounded mb-3" style={{ backgroundColor: '#f8f9fa' }}>
                        <p className="text-muted mb-3">
                            Choose a layout template that matches your card design requirements.
                            Each template shows the exact dimensions and print capabilities.
                        </p>

                        <Row className="g-4">
                            {layouts.map((layout) => (
                                <Col sm={6} lg={3} key={layout.id}>
                                    <Card
                                        className={`h-100 transition-all text-center cursor-pointer ${selectedLayout === layout.id
                                                ? 'border-primary shadow-sm'
                                                : ''
                                            }`}
                                        onClick={() => handleLayoutSelect(layout.id)}
                                        onDoubleClick={() => handleLayoutDoubleClick(layout.id)}
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <Card.Body className="p-3">
                                            <div className="mb-3">
                                                <div
                                                    style={{
                                                        width: `${Math.round(layout.height * 0.6)}px`,
                                                        height: `${Math.round(layout.width * 0.6)}px`,
                                                        backgroundColor: '#d3d3d3',
                                                        border: '1px solid #999',
                                                        borderRadius: '4px',
                                                        position: 'relative',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '10px',
                                                        color: '#000',
                                                        fontWeight: 'normal'
                                                    }}
                                                    className="mx-auto"
                                                >
                                                    <div className="mb-1">
                                                        {layout.description}
                                                    </div>
                                                    <div>
                                                        {layout.width} x {layout.height}px
                                                    </div>

                                                    {selectedLayout === layout.id && (
                                                        <div className="position-absolute top-0 end-0 p-2">
                                                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                                                style={{ width: '24px', height: '24px' }}>
                                                                <Check size={16} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div style={{ color: '#000', fontSize: '14px', fontWeight: 'normal' }}>
                                                {layout.isMonochrome ? (
                                                    <Badge bg="secondary" className="mb-2">Monochrome</Badge>
                                                ) : (
                                                    <Badge bg="info" className="mb-2">Color & HoloKote</Badge>
                                                )}
                                                <br />
                                                <span style={{ fontSize: '13px' }}>
                                                    {layout.width} x {layout.height}px
                                                </span>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    {selectedLayout && (
                        <Button variant="primary" onClick={() => setShowModal(false)}>
                            Continue with {getSelectedLayoutName()}
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            <style jsx>{`
                .hover-shadow:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
                    transform: translateY(-2px);
                }
                .transition-all {
                    transition: all 0.2s ease;
                }
            `}</style>
        </>
    );
};

export default LayoutSelector;

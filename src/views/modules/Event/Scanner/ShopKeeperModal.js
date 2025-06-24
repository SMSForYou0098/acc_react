import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Card, InputGroup } from 'react-bootstrap';
import {
    FaWallet,
    FaUser,
    FaMoneyBillWave,
    FaExclamationTriangle,
    FaTimes,
    FaRupeeSign
} from 'react-icons/fa';

const ShopKeeperModal = ({ show, onHide, ticketData, handleDebit }) => {
    const [amount, setAmount] = useState('');
    const predefinedAmounts = [100, 200, 500, 1000];
    const [remarks, setRemarks] = useState('');
    const balance = ticketData?.user_balance ?? 0;
    const isAmountValid = amount && Number(amount) <= balance;
    const remainingBalance = balance - (Number(amount) || 0);
    const errorMessage = amount ? (
        Number(amount) <= 0 ? 
            'Amount must be greater than 0' :
        Number(amount) > balance ?
            `Amount exceeds available balance (₹${balance})` :
            ''
    ) : '';

    const handleSubmit = (e) => {
        e.preventDefault();
        handleDebit(Number(amount), remarks);
        setAmount('');
        setRemarks('');
    };
    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (value === '' || (Number(value) >= 0 && Number(value) <= balance)) {
            setAmount(value);
        }
    };
    return (
        <Modal show={show} onHide={onHide} size='xl'>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title className="d-flex align-items-center">
                    <FaWallet className="me-2" /> Wallet Details
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* User Info Row */}
                <Row className="align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center">
                            <FaUser className="me-2 text-primary" />
                            <h5 className="mb-0">User : {ticketData?.user?.name}</h5>
                        </div>
                        <div className="d-flex flex-column">
                            <div className="d-flex align-items-center">
                                <FaMoneyBillWave className="me-2 text-success" />
                                <h5 className="mb-0">Balance : ₹{balance}</h5>
                            </div>
                            {amount && (
                                <div className="d-flex align-items-center mt-1">
                                    <small className={`${remainingBalance < 0 ? 'text-danger' : 'text-muted'}`}>
                                        Remaining Balance: <div className="text-secondary">₹{remainingBalance}</div>
                                    </small>
                                </div>
                            )}
                        </div>
                    </div>
                </Row>
                {balance <= 0 ? (
                    <Card className="text-center">
                        <Card.Body className="py-4">
                            <div className="mb-3">
                                <FaExclamationTriangle
                                    size={40}
                                    className="text-danger mb-3"
                                />
                                <h4 className="text-danger mb-2">Insufficient Balance</h4>
                                <div className="d-flex align-items-center justify-content-center gap-2">
                                    <FaRupeeSign className="text-muted" />
                                    <span className="fs-5 text-muted">
                                        Current Balance: {balance}
                                    </span>
                                </div>
                            </div>
                            <Button
                                variant="outline-danger"
                                onClick={onHide}
                                className="px-4"
                            >
                                <FaTimes className="me-2" />
                                Close
                            </Button>
                        </Card.Body>
                    </Card>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Enter Amount to Debit</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaRupeeSign className="text-muted" />
                                </InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    placeholder="Enter amount"
                                    required
                                    min="1"
                                    max={balance}
                                    isInvalid={amount && !isAmountValid}
                                />
                                {amount && !isAmountValid && (
                                    <Form.Control.Feedback type="invalid">
                                        {errorMessage}
                                    </Form.Control.Feedback>
                                )}
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Purpose/Remarks <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Enter purpose of transaction"
                                required
                                isInvalid={!remarks.trim() && amount}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter transaction purpose
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                            <span className="fw-bold">Quick Amount:</span>
                            {predefinedAmounts.map((preAmount) => (
                                <Button
                                    key={preAmount}
                                    variant={amount === preAmount ? "primary" : "outline-primary"}
                                    size="sm"
                                    onClick={() => setAmount(preAmount)}
                                    disabled={preAmount > balance}
                                >
                                    ₹{preAmount}
                                </Button>
                            ))}
                        </div>

                        <div className="d-grid">
                            <Button
                                type="submit"
                                variant="primary"
                                size="medium"
                                disabled={!isAmountValid}
                            >
                                {isAmountValid ? (
                                    <div className='d-flex align-items-center justify-content-center gap-2'>
                                        Debit
                                        <span>₹{amount}</span>
                                    </div>
                                ) : 'Enter Valid Amount'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default ShopKeeperModal;
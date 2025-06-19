import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { FaCalendarAlt, FaEye } from 'react-icons/fa';
import { useMyContext } from '../../../../../Context/MyContextProvider';
import useFetchTransactions from './fetchTransactions';


const TransactionHistory = ({ id }) => {
    const [transactions, setTransactions] = useState([]);
    const { api, authToken } = useMyContext();
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const fetchTransactions = useFetchTransactions(api, id, authToken, setTransactions, setLoading);
    useEffect(() => {
        if (id && authToken) {
            fetchTransactions();
        }
    }, [id, authToken, api]);

    const handleShowDetails = (transaction) => {
        setSelectedTransaction(transaction);
        setShowModal(true);
    };
    return (
        <>
            <div className="transaction-history">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Transaction History</h4>
                </div>
                <div className="transaction-list-container">
                    <Row>
                        {transactions.map((transaction) => (
                            <Col key={transaction.transaction_id} xs={12} className="mb-3">
                                <Card className="transaction-card hover-shadow">
                                    <Card.Body className="py-2">
                                        <Row className="align-items-center">
                                            <Col xs={7}>
                                                <div className="transaction-info">
                                                    {transaction?.shop_data ? (
                                                        <h5 className="mb-1">{transaction?.shop_data?.shop_name}</h5>
                                                    ) : (
                                                        <h5 className="mb-1">
                                                            {transaction.payment_type === 'credit' ? 'Amount Credited' : 'Amount Deducted'}
                                                        </h5>
                                                    )}
                                                    <small className="text-muted d-flex align-items-center">
                                                        <FaCalendarAlt className="me-1" size={12} />
                                                        {new Date(transaction.created_at).toLocaleDateString('en-IN')}
                                                    </small>
                                                </div>
                                            </Col>

                                            <Col xs={5} className="text-end">
                                                <div>
                                                    <h4 className={`mb-1 ${transaction.payment_type === 'credit' ? 'text-success' : 'text-danger'}`}>
                                                        {transaction.payment_type === 'credit' ? '+' : '-'}₹{transaction.new_credit?.toFixed(2)}
                                                    </h4>
                                                    <Button
                                                        variant="link"
                                                        className="p-0 text-primary"
                                                        onClick={() => handleShowDetails(transaction)}
                                                    >
                                                        <FaEye size={14} className="me-1" />
                                                        <small>View Details</small>
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Transaction Details Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Transaction Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedTransaction && (
                            <div className="transaction-details">
                                <div className="mb-3 text-center">
                                    <h5 className={`${selectedTransaction.payment_type === 'credit' ? 'text-success' : 'text-danger'}`}>
                                        {selectedTransaction.payment_type === 'credit' ? '+' : '-'}
                                        ₹{selectedTransaction.new_credit?.toFixed(2)}
                                    </h5>
                                    <small className="text-muted d-block">
                                        Balance: ₹{selectedTransaction.total_credits?.toFixed(2)}
                                    </small>
                                </div>

                                <div className="details-list">
                                    <div className="detail-item d-flex justify-content-between py-2 border-bottom">
                                        <span className="text-muted">Transaction ID</span>
                                        <span>#{selectedTransaction.transaction_id}</span>
                                    </div>

                                    <div className="detail-item d-flex justify-content-between py-2 border-bottom">
                                        <span className="text-muted">Date & Time</span>
                                        <span>{new Date(selectedTransaction.created_at).toLocaleString('en-IN')}</span>
                                    </div>

                                    <div className="detail-item d-flex justify-content-between py-2 border-bottom">
                                        <span className="text-muted">Payment Method</span>
                                        <span>{selectedTransaction.payment_method || 'N/A'}</span>
                                    </div>

                                    {selectedTransaction?.shop_data && (
                                        <div className="detail-item d-flex justify-content-between py-2 border-bottom">
                                            <span className="text-muted">Used At</span>
                                            <span>{selectedTransaction.shop_data.shop_name}</span>
                                        </div>
                                    )}

                                    {selectedTransaction.assign_by && (
                                        <div className="detail-item d-flex justify-content-between py-2 border-bottom">
                                            <span className="text-muted">Transferred  By</span>
                                            <span>{selectedTransaction.assign_by.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                </Modal>
            </div>


            <style>
                {`
            .transaction-list-container {
                max-height: 60vh;
                overflow-y: auto;
                overflow-x: hidden;
                padding-right: 10px;
            }
            /* Existing styles */
            .transaction-card {
                transition: all 0.3s ease;
                border: none;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .hover-shadow:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
        `}
            </style>
        </>



    );
};

export default TransactionHistory;
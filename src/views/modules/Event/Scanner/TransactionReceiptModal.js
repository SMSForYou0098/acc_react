import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { capitilize } from './Transactions';
import { useReactToPrint } from 'react-to-print';
import styled from 'styled-components';
import { useMyContext } from '../../../../Context/MyContextProvider';
import axios from 'axios';
export const PrintWrapper = styled.div`
    @media print {
        margin: 0;
        padding: 5mm;
        width: fit-content;
        
        @page {
            size: auto;
            margin: 0mm;
        }

        /* Hide modal elements */
        .modal-header,
        .modal-footer,
        .no-print {
            display: none !important;
        }

        /* Content container */
        .content-wrapper {
            width: fit-content !important;
            min-width: 58mm !important;
            max-width: 80mm !important;
            margin: 0 auto !important;
            word-wrap: break-word !important;
            white-space: normal !important;
        }

        /* Text wrapping for all content */
        div, span, p {
            white-space: normal !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
        }

        /* Ensure fixed width for labels */
        strong.me-2 {
            display: inline-block !important;
            width: 85px !important;
        }

        /* Flexible content area */
        .content-row {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 2mm !important;
            margin-bottom: 2mm !important;
        }

        .content-value {
            flex: 1 !important;
            min-width: 0 !important; /* Allows text to wrap */
        }

        hr {
            margin: 3mm 0 !important;
            width: 100% !important;
        }

        .mb-2 {
            margin-bottom: 2mm !important;
        }

        .mb-3 {
            margin-bottom: 3mm !important;
        }
    }
`;
const TransactionReceiptModal = ({ show, onHide, transactionId }) => {
    const { api, authToken, loader } = useMyContext();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            if (transactionId && show) {
                setLoading(true);
                try {
                    const response = await axios.get(`${api}transactions-data/${transactionId}`, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    });
                    setTransaction(response.data?.data);
                } catch (error) {
                    console.error('Error fetching transaction details:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTransactionDetails();
        return () => {
            setTransaction(null);
        };
    }, [transactionId, show, api, authToken]);

    const printRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });
    return (
        <Modal show={show} onHide={onHide} size="sm">
            <Modal.Header closeButton>
                <Modal.Title className="h6">Transaction Receipt</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center p-3">
                        <img src={loader} alt="Loading..." style={{ width: '50px' }} />
                    </div>
                ) : (
                    <PrintWrapper ref={printRef}>
                        <h5 className="mb-3 text-center">{transaction?.shop_name}</h5>
                        <div className="mb-2 text-center">
                            <small>Date: {new Date(transaction?.transaction_date).toLocaleString()}</small>
                        </div>
                        <hr />
                        <div className="d-flex flex-column align-items-center">
                            <div>
                                <div className="mb-2">
                                    <strong className="me-2">Customer:</strong>
                                    <span>{capitilize(transaction?.user_name)}</span>
                                </div>
                                <div className="mb-2">
                                    <strong className="me-2">Amount:</strong>
                                    <span>₹{transaction?.credits}</span>
                                </div>
                                <div className="mb-2">
                                    <strong className="me-2">Shop Owner:</strong>
                                    <span>{transaction?.shop_user_name}</span>
                                </div>
                                {transaction?.description && (
                                    <div className="mb-2">
                                        <strong className="me-2">Description:</strong>
                                        <span>{transaction?.description}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <hr />
                        <div className="text-muted text-center">
                            <small>Thank you for your business!</small>
                        </div>
                    </PrintWrapper>
                )}
            </Modal.Body>
            <Modal.Footer className="justify-content-center no-print">
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => handlePrint()}>
                    Print
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TransactionReceiptModal;
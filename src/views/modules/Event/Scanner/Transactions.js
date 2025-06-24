import React, { useEffect, useState } from 'react';
import { useMyContext } from '../../../../Context/MyContextProvider';
import useFetchTransactions from '../User/Transaction/fetchTransactions';
// import CustomDataTable from './CustomDataTable';
import { ArrowDownCircle, ArrowUpCircle, Printer, PrinterIcon } from 'lucide-react';
import { Button, Card } from 'react-bootstrap';
import { CustomTooltip } from '../CustomUtils/CustomTooltip';
import TransactionReceiptModal from '../Scanner/TransactionReceiptModal';
import CommonListing from '../CustomUtils/CommonListing';

export const capitilize = (name) => {
    return name?.replace(/\b\w/g, (char) => char?.toUpperCase()) ?? 'N/A';
};

const Transactions = () => {
    const { UserData, api, authToken, formatDateTime } = useMyContext();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchTransactions = useFetchTransactions(api, UserData?.id, authToken, setTransactions, setLoading);

    useEffect(() => {
        if (UserData && authToken) {
            setLoading(true);
            fetchTransactions();
        }
    }, [UserData, authToken, api]);

    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);

    const HandlePrint = (transactionId) => {
        setSelectedTransactionId(transactionId);
        setShowReceiptModal(true);
    };

    const columns = [
        {
            dataField: 'id',
            text: '#',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
            headerStyle: { width: '70px' },
            headerAlign: 'center',
            align: 'center',
            sort: true,
        },
        {
            dataField: 'user.name',
            text: 'User Name',
            formatter: (cell, row) => capitilize(row.user?.name),
            headerAlign: 'center',
            align: 'center',
            sort: true,
            //filter: textFilter()
        },
        {
            dataField: 'user.number',
            text: 'Number',
            headerAlign: 'center',
            align: 'center',
            sort: true,
        },
        {
            dataField: 'new_credit',
            text: 'Amount',
            headerAlign: 'center',
            align: 'center',
            sort: true,
            sortFunc: (a, b, order) => {
                if (order === 'asc') {
                    return parseFloat(a) - parseFloat(b);
                }
                return parseFloat(b) - parseFloat(a);
            }
        },
        {
            dataField: 'payment_method',
            text: 'Payment Method',
            formatter: (cell) => capitilize(cell),
            headerAlign: 'center',
            align: 'center',
            sort: true,
        },
        {
            dataField: 'payment_type',
            text: 'Payment Type',
            formatter: (cell) => (
                <span className={`d-flex align-items-center gap-1 ${cell === 'credit' ? 'text-success' : 'text-danger'}`}>
                    {cell === 'credit' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                    {cell === 'credit' ? 'Credit' : 'Debit'}
                </span>
            ),
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'transaction_id',
            text: 'Transaction ID',
            headerAlign: 'center',
            align: 'center',
            sort: true,
        },
        {
            dataField: 'created_at',
            text: 'Date & Time',
            formatter: (cell) => formatDateTime(cell),
            headerAlign: 'center',
            align: 'center',
            sort: true,
        },
        {
            dataField: 'assign_by.name',
            text: 'Transferred By',
            formatter: (cell, row) => capitilize(row.assign_by?.name),
            headerAlign: 'center',
            align: 'center',
            sort: true,
        },
        {
            dataField: 'shop_data.shop_name',
            text: 'Used At',
            formatter: (cell, row) => capitilize(row.shop_data?.shop_name),
            headerAlign: 'center',
            align: 'center',
            sort: true,
        },
        {
            dataField: 'status',
            text: 'Status',
            formatter: (cell, row) => {
                const status = cell || (row.bookings && row.bookings[0]?.status);
                const statusInt = parseInt(status);
                return (
                    <span className={`badge p-1 bg-${statusInt === 0 ? "warning" : "success"}`}>
                        {statusInt === 0 ? "Cancelled" : "Paid"}
                    </span>
                );
            },
            headerAlign: 'center',
            align: 'center',
            sort: true,
        },
        {
            dataField: 'action',
            text: 'Action',
            formatter: (cell, row) => (
                <CustomTooltip text={row.payment_type === 'debit' ? 'Printing not available for debit transactions' : 'Send Receipt'}>
                    <Button
                        variant="primary"
                        className="btn-sm btn-icon"
                        onClick={() => HandlePrint(row.id)}
                        disabled={row.payment_type === 'debit'}
                    >
                        <Printer size={16} />
                    </Button>
                </CustomTooltip>
            ),
            headerAlign: 'center',
            align: 'center',
            sort: true,
        }

    ];
    return (
        <>
            <TransactionReceiptModal
                show={showReceiptModal}
                onHide={() => setShowReceiptModal(false)}
                transactionId={selectedTransactionId}
            />
            <CommonListing
                tile={'Transaction History'}
                bookings={transactions}
                ShowReportCard={false}
                // dateRange={dateRange}
                exportPermisson={'Export Agent Bookings'}
                loading={loading}
                columns={columns}
                // setDateRange={setDateRange}
                bookingLink={"new"}
                // ButtonLable={'New Booking'}
            />
        </>
    );
};

export default Transactions;
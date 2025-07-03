import React, { memo, useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import useSound from 'use-sound';

import beepSound from '../../../../assets/event/stock/tik.mp3';
import errorSound from '../../../../assets/event/stock/error.mp3';
import { useMyContext } from '../../../../Context/MyContextProvider';
import MobileScan from './MobileScanButton';
import ScanedUserData from './ScanedUserData';
import TickeScanFeilds from './TickeScanFeilds';
import AdminActionModal from './AdminActionModal';

const TicketVerification = memo(({
    scanMode = 'manual',
}) => {
    const { api, userRole, formatDateTime, authToken, UserData, isMobile, successAlert } = useMyContext();
    const [QRdata, setQRData] = useState('');
    const [type, setType] = useState('');
    const [show, setShow] = useState(false);
    const [iDCardData,setIdCardData] = useState({})
    const [autoCheck, setAutoCheck] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [tokenLength, setTokenLength] = useState(8);
    const [play] = useSound(beepSound);
    const [error] = useSound(errorSound);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [pendingQRData, setPendingQRData] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);
    const [scanType, setScanType] = useState('verify'); 
    // Handle admin actions
    const handleAdminAction = async (actionType,data) => {
        let token = pendingQRData ?? data;
        try {
            setIsProcessing(true);
            setSelectedAction(actionType);
            switch (actionType) {
                case 'verify':
                    await getTicketDetail(token);
                    break;
                case 'cancel':
                    setShowAdminModal(false);
                    break;
                default:
                    break;
            }
        } catch (err) {
            SweetalertError(err?.response?.data?.message);
        } finally {
            setShowAdminModal(false);
            setPendingQRData(null);
            setIsProcessing(false);
        }
    };

    const getTokenLength = async () => {
        try {
            const res = await axios.get(`${api}scanner-token-length/${UserData?.id}`, {
                headers: { 'Authorization': 'Bearer ' + authToken }
            });

            if (res.data.status) {
                setTokenLength(res.data.tokenLength);
            }
        } catch (err) {
            // SweetalertError(err.response.data.message);
        } finally {
            // setIsProcessing(false);
        }
    };

    useEffect(() => {
        getTokenLength();
    }, []);

    // Get ticket details when QR data is complete
    const getTicketDetail = async (data) => {
        try {
            const res = await axios.post(`${api}verify-card/${data}`,
                { user_id: UserData?.reporting_user },
                { headers: { 'Authorization': 'Bearer ' + authToken } }
            );
            if (res.data.status) {
                play();
                setIdCardData(res.data.data)
                setShow(true);
                setQRData(data)
            }
        } catch (err) {
            setQRData('');
            const formattedTime = formatDateTime(err?.response?.data?.time);
            const message = err?.response?.data?.time
                ? `Check In: <strong>${formattedTime}</strong>`
                : '';

            Swal.fire({
                icon: 'error',
                title: err?.response?.data?.message,
                html: message,
                timer: 1000
            });
            error();
        }
    };
   
    // Trigger ticket detail fetch when QR data reaches correct length
    useEffect(() => {
        if (QRdata?.length === tokenLength) {
            if (userRole === 'Admin') {
                if (scanType === 'verify' || scanType === 'shopkeeper') {
                    handleAdminAction(scanType,QRdata);
                } else {
                    // Show modal only if no scan type is selected
                    setPendingQRData(QRdata);
                    setShowAdminModal(true);
                }
            }  else {
                getTicketDetail(QRdata);
            }
        }
    }, [QRdata,type]);


    // Verify ticket
    const handleVerify = async () => {
        if (QRdata && !isProcessing) {
            setIsProcessing(true);
            try {
                const res = await axios.get(`${api}chek-in/${QRdata}`, {
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });

                if (res.data.status) {
                    successAlert('ID Card Scanned Successfully!');
                    setQRData('');
                    setShow(false);
                }
            } catch (err) {
                SweetalertError(err.response.data.message);
            } finally {
                setIsProcessing(false);
            }
        }
    };


    // Error alert
    const SweetalertError = (data) => {
        Swal.fire({
            icon: "error",
            title: data,
            timer: 1000,
            willClose: () => setIsProcessing(false)
        });
    };

    // Auto-check mechanism
    useEffect(() => {
        if (show && autoCheck) {
            const timer = setTimeout(handleVerify, 900);
            return () => clearTimeout(timer);
        }
    }, [show, autoCheck]);

    return (
        <>
            <AdminActionModal
                show={showAdminModal}
                onHide={() => {
                    setShowAdminModal(false);
                    setPendingQRData(null);
                }}
                onActionSelect={handleAdminAction}
            />
           
            {(userRole === 'Scanner' || selectedAction === 'verify') && (
                <ScanedUserData
                    show={show}
                    iDCardData={iDCardData}
                    setShow={setShow}
                    handleVerify={handleVerify}
                />
            )}
            {/* Event Statistics */}
            <Row>
                {isMobile && <MobileScan />}
                <Row>
                    {isMobile && <MobileScan />}
                    <TickeScanFeilds
                        scanMode={scanMode}
                        QRdata={QRdata}
                        setQRData={setQRData}
                        autoCheck={autoCheck}
                        setAutoCheck={setAutoCheck}
                        scanType={scanType}
                        setScanType={setScanType}
                        userRole={userRole}
                    />
                </Row>
            </Row>
        </>
    );
});

export default TicketVerification;

import React, { useRef, useEffect } from 'react';
import { Card, Form, Col, Row } from 'react-bootstrap';
import QrScanner from 'qr-scanner';

const TickeScanFeilds = ({
    scanMode = 'manual',
    QRdata,
    setQRData,
    autoCheck,
    setAutoCheck,
    scanType,
    setScanType,
    userRole
}) => {
    const videoElementRef = useRef(null);

    const styles = scanMode === 'camera' ? {
        qrVideo: {
            objectFit: 'cover',
            height: '70vh',
            borderRadius: '10px',
        }
    } : {};

    useEffect(() => {
        if (scanMode === 'camera' && videoElementRef.current) {
            const qrScanner = new QrScanner(
                videoElementRef.current,
                (result) => {
                    if (result?.data) {
                        setQRData(result.data);
                    }
                },
                {
                    returnDetailedScanResult: true,
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                }
            );
            qrScanner.start();

            return () => {
                qrScanner.stop();
                qrScanner.destroy();
            };
        }
    }, [scanMode]);

    return (
        <Col sm="12" lg="4">
            <Card>
                <Card.Body className="d-flex justify-content-center flex-column">
                        <Row className="d-flex align-items-center mb-3">
                            <Col md={6}>
                                <Form.Check
                                    type="switch"
                                    label="Auto Check"
                                    checked={autoCheck}
                                    onChange={(e) => setAutoCheck(e.target.checked)}
                                />
                            </Col>
                            {userRole === 'Admin' && (
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Select
                                            value={scanType}
                                            onChange={(e) => setScanType(e.target.value)}
                                        >
                                            <option value="">Select Type</option>
                                            <option value="verify">Verify Ticket</option>
                                            <option value="shopkeeper">Shopkeeper Mode</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            )}
                        </Row>

                    {scanMode === 'manual' ? (
                        <Form.Control
                            type="text"
                            value={QRdata}
                            onChange={(e) => setQRData(e.target.value)}
                            placeholder="QR Data"
                            maxLength={9}
                            autoFocus
                        />
                    ) : (
                        <video style={styles.qrVideo} ref={videoElementRef} />
                    )}
                </Card.Body>
            </Card>
        </Col>
    );
};

export default TickeScanFeilds;

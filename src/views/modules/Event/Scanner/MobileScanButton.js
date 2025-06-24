import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'


const MobileScan = () => {
    return (
        <Container
            fluid
            className={`d-flex flex-column justify-content-end`}
            style={{
                position: 'fixed',
                left: '0',
                zIndex: '99',
                bottom: '0',
                maxWidth: '100%',
                margin: '0',
                padding: '0',
            }}
            onClick={() => window.location.reload()}
        >
            <Row className="g-0">
                <Col xs={12} className="p-0">
                    <Button
                        variant="primary"
                        className="w-100 text-white py-4"
                        style={{ borderRadius: '0' }}
                    >
                        Scan
                    </Button>
                </Col>
            </Row>
        </Container>

    )
}

export default MobileScan
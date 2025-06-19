import { LayoutDashboard, TicketIcon } from 'lucide-react'
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { AnimatedButton } from '../../CustomComponents/MobileBottomMenu'

const MobBookingButton = ({ to }) => {
    const navigate = useNavigate()
    const buttons = [
        { key: "DashBaord", onClick: () => { navigate("/dashboard") }, Icon: LayoutDashboard, text: "Home", animation: { scale: [1, 1.3, 1] } },
        { key: "Book Now", onClick: () => { navigate(to) }, Icon: TicketIcon, text: "Book Now", animation: { rotate: [0, -45, 0] } },
    ];
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
                {/* <Col xs={6} className="p-0">
                    <Link to={'/dashboard'}>
                        <Button
                            variant="secondary"
                            className="w-100 text-white py-4"
                            style={{ borderRadius: '0' }}
                        >
                            <LayoutDashboard />
                        </Button>
                    </Link>
                </Col>
                <Col xs={6} className="p-0">
                    <Link to={to}>
                        <Button
                            variant="primary"
                            className="w-100 text-white py-4"
                            style={{ borderRadius: '0' }}
                        >
                            Book Ticket
                        </Button>
                    </Link>
                </Col> */}

                {buttons.map((item) => (
                    <Col key={item.key} xs={6} className="p-0">
                        <AnimatedButton {...item} isActive={false} />
                    </Col>
                ))}
            </Row>
        </Container>

    )
}

export default MobBookingButton

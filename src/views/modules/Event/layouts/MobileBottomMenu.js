import { HomeIcon, LayoutDashboard, MenuIcon, TicketIcon, UserIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Button, Col, Container, Nav, Offcanvas, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useMyContext } from '../../../../Context/MyContextProvider'
import { motion } from "framer-motion";
import CustomMenu from '../CustomComponents/CustomMenu'

export const AnimatedButton = ({ onClick, Icon, text, animation, isActive }) => (
    <Button
        onClick={onClick}
        className={`w-100 py-3 border-0 d-flex flex-column align-items-center ${isActive ? "bg-primary text-white" : "bg-white text-black"}`}
        style={{ borderRadius: "0" }}
    >
        <motion.div animate={animation} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>
            <Icon color={isActive ? "#fff" : "#481fa8"} size={20} />
        </motion.div>
        <span className="mt-2" style={{ fontSize: "12px" }}>{text}</span>
    </Button>
);
const MobileBottomMenu = ({hideMenu = false}) => {
  
    const { UserData } = useMyContext()
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(!show);
    const [activeButton, setActiveButton] = useState("home"); // Default active button
    const navigate = useNavigate()
      if(hideMenu) return null; // If hideMenu is true, don't render the menu
    const HandleNavigate = () => {
        let path;
        if (UserData && Object.keys(UserData)?.length > 0) {
            path = `/dashboard/users/manage/${UserData?.id}`
        } else {
            path = '/sign-in'
        }
        navigate(path)
    }
    const buttons = [
        { key: "home", onClick: () => { navigate("/"); setActiveButton("home"); }, Icon: HomeIcon, text: "Home", animation: { scale: [1, 1.3, 1] } },
        { key: "events", onClick: () => { navigate("/events"); setActiveButton("events"); }, Icon: LayoutDashboard, text: "Events", animation: { rotate: [0, -45, 0] } },
        { key: "profile", onClick: () => { HandleNavigate(); setActiveButton("profile"); }, Icon: UserIcon, text: "Profile", animation: { scale: [1, 1.3, 1] } },
        { key: "menu", onClick: () => { handleShow(); setActiveButton("menu"); }, Icon: MenuIcon, text: "Menu", animation: { scale: [1, 1.3, 1] } },
      ];
    return (
        <>
            <Offcanvas
                show={show}
                onHide={handleClose}
                className="mobile-offcanvas nav navbar navbar-expand-xl hover-nav py-0 w-75"
                style={{
                    background: 'linear-gradient(to bottom, #17132E 0%, rgba(23, 19, 46, 0.5) 100%)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                }}
            >

                <Container fluid className="p-0">
                    <Offcanvas.Header closeButton className="px-0 mx-3">
                        <Link to="home" className="navbar-brand ms-3">
                        </Link>
                    </Offcanvas.Header>
                    <Offcanvas.Body className='p-0'>
                        <div className="landing-header">
                            <Nav
                                as="ul"
                                style={{ backgroundColor: 'transparent' }}
                                className="navbar-nav iq-nav-menu list-unstyled"
                                id="header-menu"
                            >
                                <CustomMenu handleClose={handleClose} />
                            </Nav>
                        </div>
                    </Offcanvas.Body>
                </Container>
            </Offcanvas>
            <Container
                fluid
                className={`d-flex flex-column justify-content-end`}
                style={{
                    position: 'fixed',
                    left: '0',
                    zIndex: '98',
                    bottom: '0',
                    maxWidth: '100%',
                    margin: '0',
                    padding: '0',
                }}
            >
                <Row className="g-0">
                    {buttons.map((item,index) => (
                        <Col key={item.key} xs={3} className="p-0">
                            <AnimatedButton {...item} isActive={activeButton === item.key} key={index}/>
                        </Col>
                    ))}
                </Row>
                 <div
                    style={{
                        position: 'absolute',
                        top: '-30px', // Half of the button height to make it half outside
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: '9999',
                    }}
                >
                    <Button
                        className="btn-secondary rounded-circle"
                        style={{
                            width: '60px',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}
                        onClick={() => navigate('/events')} // Navigate to "Book Now" page
                    >
                        <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <TicketIcon color="white" size={20} />
                        </motion.div>
                        <span style={{ fontSize: '10px', marginTop: '5px' }}>Book</span>
                    </Button>
                </div>
            </Container>
        </>

    )
}

export default MobileBottomMenu
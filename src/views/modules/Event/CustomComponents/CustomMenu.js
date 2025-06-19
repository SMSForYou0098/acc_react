import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Image, Modal, Nav, Row } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios';
import Mumbai from '../../../../assets/event/stock/cities/mumbai.png';
import Delhi from '../../../../assets/event/stock/cities/delhi.png';
import Bengaluru from '../../../../assets/event/stock/cities/bangluru.png';
import Hyderabad from '../../../../assets/event/stock/cities/hydrabad.png';
import Chandigarh from '../../../../assets/event/stock/cities/chandigargh.png';
import Ahmedabad from '../../../../assets/event/stock/cities/ahmedabad.png';
import { useMyContext } from '../../../../Context/MyContextProvider';
import { MapPin } from 'lucide-react';
const CustomMenu = ({ handleClose }) => {
    const { UserData, userRole, isMobile, api, createSlug } = useMyContext();
    let location = useLocation();
    const home = userRole === 'User' ? 'dashboard/bookings' : 'dashboard'
    const CloseMenu = () => {
        if (handleClose) {
            handleClose()
        }
    }
    const popularCities = [
        { name: 'Mumbai', icon: Mumbai },
        { name: 'Delhi-NCR', icon: Delhi },
        { name: 'Bengaluru', icon: Bengaluru },
        { name: 'Hyderabad', icon: Hyderabad },
        { name: 'Chandigarh', icon: Chandigarh },
        { name: 'Ahmedabad', icon: Ahmedabad },
    ];
    const [show, setShow] = useState(false)
    const [menu, setMenu] = useState()
    const handleCloseModel = () => setShow(false);
    const handleShowMode = () => setShow(true);
    const [userLocation, setUserLocation] = useState(null);
    const [error, setError] = useState(null);

    const detectLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await axios.get(
                            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                        );
                        const city = response.data.city || 'City not found';
                        console.log(city);
                        setUserLocation(city);
                        setError(null);
                    } catch (err) {
                        setError('Error retrieving city name.');
                    }
                },
                (error) => {
                    setError('Unable to retrieve your location.');
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };
    const cityIconStyle = {
        width: "60px",
        height: "60px",
        objectFit: "cover"
    }

    const GetMenu = async () => {
        try {
            const res = await axios.get(`${api}active-menu`)
            setMenu(res.data?.menu?.navigation_menu)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        GetMenu()
    }, []);

    const getClassName = (menu, location) => {
        const isActive =
            location.pathname === `/home/dashboard/bookings/${createSlug(menu?.title)}` ||
            location.pathname === `/home/dashboard/${createSlug(menu?.title)}`;
        return `${isActive ? "active" : ""} nav-link`;
    };

    const getLinkTo = (menu) => {
        let isHome = menu?.title?.toLowerCase() === "home"
        let isContact = menu?.title === "contact us"
        if (isHome) {
            return menu?.type === 1 ? menu?.external_url : `home`;
        } else {
            return menu?.type === 1 ? menu?.external_url : `home/${createSlug(menu?.title)}`;
        }
    };
    return (
        <>
            {/* model  */}
            <Modal show={show} onHide={handleCloseModel} centered size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Select Your City</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="citySearch">
                            <Form.Control type="text" placeholder="Search for your city" />
                        </Form.Group>
                        {/* <Button variant="secondary" className="w-100 my-3" onClick={()=>detectLocation()}> */}
                        <Button variant="primary" className="w-100 my-3" onClick={() => detectLocation()}>
                            Detect my location
                        </Button>
                    </Form>
                    <h5 className="text-center">Popular Cities</h5>
                    <Row>
                        {popularCities.map((city, index) => (
                            <Col xs={4} md={3} lg={2} key={index} className="text-center">
                                <Image src={city.icon} alt={city.name} fluid className="mb-2" style={cityIconStyle} />
                                <p>{city.name}</p>
                            </Col>
                        ))}
                    </Row>
                    {/* <div className="text-center mt-3">
                        <Button variant="link">View All Cities</Button>
                        {popularCities.map((city, index) => (
                            <Col xs={4} md={3} lg={2} key={index} className="text-center">
                                <Image src={city.icon} alt={city.name} fluid className="mb-2" style={cityIconStyle}/>
                                <p>{city.name}</p>
                            </Col>
                        ))}
                    </div> */}
                </Modal.Body>
            </Modal>
            {/* end model */}
            {menu?.map((menu, index) => (
                <Nav.Item as="li" key={index}>
                    <Link
                        target={menu?.new_tab === 1 ? "_blank" : "_self"}
                        className={getClassName(menu, location)}
                        to={getLinkTo(menu)}
                        onClick={() => CloseMenu()}
                    >
                        {menu?.title}
                    </Link>
                </Nav.Item>
            ))}

            <div className="alt d-flex justify-content-center gap-1 align-items-center">
                {!isMobile &&
                    <hr className="hr-horizontal" style={{ width: '35px', transform: 'rotate(90deg)' }} />
                }
                <Nav.Item as="li"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleShowMode();
                        // if (handleClose) {
                        //     handleClose();
                        // }
                    }}
                >
                    <div style={{ cursor: 'pointer' }} className='d-flex align-items-center'>
                        <MapPin size={16} color='grey' />
                        <Link className={`nav-link `} o="#"> City </Link>
                    </div>
                </Nav.Item>
                <hr className="hr-horizontal" style={{ width: '35px', transform: 'rotate(90deg)' }} />
                <Nav.Item as="li" onClick={() => CloseMenu()} className=''>
                    <Link
                        className={`${location.pathname === ("/sign-in" || home)
                            ? "active"
                            : ""
                            } nav-link btn btn-secondary text-white px-3 py-1`}
                        to={UserData && Object.keys(UserData)?.length > 0 ? home : "/sign-in"}
                    >
                        {UserData && Object.keys(UserData)?.length > 0 ? 'Dashboard' : 'Login'}
                    </Link>

                </Nav.Item>
            </div>
        </>
    )
}

export default CustomMenu
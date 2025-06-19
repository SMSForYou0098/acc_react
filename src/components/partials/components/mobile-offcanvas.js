import React, { useState, memo, Fragment } from 'react'

//React-bootstrap
import { Offcanvas, Nav, Button, Image } from 'react-bootstrap'

// Router
import { Link, useLocation } from 'react-router-dom'

const MobildeOffcanvas = memo(() => {
    //location
    let location = useLocation();

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    return (
        <Fragment>
            <Button data-trigger="navbar_main" className="d-xl-none btn btn-sm btn-primary btn-icon rounded-pill" type="button" onClick={handleShow}>
                <span className='btn-inner'>
                    <svg className="icon-20" width="20px" height="20px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"></path>
                    </svg>
                </span>
            </Button>
            <Offcanvas show={show} onHide={handleClose} className=" mobile-offcanvas nav navbar navbar-expand-xl hover-nav horizontal-nav mx-md-auto">
                <Offcanvas.Header closeButton>
                    <div className="navbar-brand">
                    {/* <Image src={'https://getyourticket.in/wp-content/uploads/2024/07/gyt-300x133.png'} alt="logo" loading="lazy" width={120}/> */}
                         {/* <h4 className="logo-title">Get Your Ticket</h4> */}
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ul className="navbar-nav nav">
                        <Nav.Item as="li"><Link className={`${location.pathname === '/horizontal' ? 'active' : ''} nav-link `} to="/horizontal"> Horizontal </Link></Nav.Item>
                        <Nav.Item as="li"><Link className={`${location.pathname === '/dual-horizontal' ? 'active' : ''} nav-link `} to="/dual-horizontal"> Dual Horizontal </Link></Nav.Item>
                        <Nav.Item as="li"><Link className={`${location.pathname === '/dual-compact' ? 'active' : ''} nav-link `} to="/dual-compact"><span className="item-name">Dual Compact</span></Link></Nav.Item>
                        <Nav.Item as="li"><Link className={`${location.pathname === '/boxed' ? 'active' : ''} nav-link `} to="/boxed"> Boxed Horizontal </Link></Nav.Item>
                        <Nav.Item as="li"><Link className={`${location.pathname === '/boxedFancy' ? 'active' : ''} nav-link `} to="/boxedFancy"> Boxed Fancy</Link></Nav.Item>
                    </ul>
                </Offcanvas.Body>
            </Offcanvas>
        </Fragment>
    )
})

MobildeOffcanvas.displayName = "MobildeOffcanvas"
export default MobildeOffcanvas
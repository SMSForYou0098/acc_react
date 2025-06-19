import { ChevronLeft, Home, Search } from 'lucide-react';
import React from 'react'
import { Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useMyContext } from '../../../../../Context/MyContextProvider';
import { PRIMARY } from '../Consts';

const CommonMobileTopBar = ({ isMobile, title }) => {
    const { isScrolled } = useMyContext()
    const navigate = useNavigate()

    if (!isMobile) return null; // Ensure the component only renders for mobile
    const handleNavigateBack = () => {
        try {
            if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
            } else {
                navigate('/');
            }
        } catch (error) {
            // Fallback to home if there's any error
            navigate('/');
        }
    };
    const goToHome = () => {
        navigate('/');
    };

    return (
        <div
            className="w-100 py-2"
            style={{
                position: 'fixed',
                left: '0',
                zIndex: '99',
                top: '0',
                backdropFilter: 'blur(5px)',
                boxShadow: isScrolled ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none', // Apply shadow when scrolled
                transition: 'box-shadow 0.3s ease', // Smooth transition for the shadow
            }}
        >
            <Row>
                <Col xs={2} className="p-0">
                    <div className="d-flex justify-content-center align-items-center">
                        <Button style={{ background: 'none' }} onClick={handleNavigateBack} className='p-0 m-0 border-0'>
                            <ChevronLeft color='grey' size={30} />
                        </Button>
                    </div>
                </Col>
                <Col xs={7} className="p-0 d-flex justify-content-start align-items-center">
                    <p className="title p-0 m-0 fw-bold">{title}</p>
                </Col>
                <Col xs={3} className="p-0">
                    <div className="d-flex justify-content-end align-items-center pe-4">
                        <Button
                            variant='primary'
                            // style={{ background: 'none' }}
                            onClick={goToHome}
                            className='py-2 m-0 border-0 btn-sm rounded-pill'>
                            <Home size={16} />
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};
export default CommonMobileTopBar

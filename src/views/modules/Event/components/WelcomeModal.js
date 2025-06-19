import React, { useEffect, useState } from 'react';
import { Image, Modal } from 'react-bootstrap';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';
import styled from 'styled-components';
import { useMyContext } from '../../../../Context/MyContextProvider';
import LoaderComp from '../CustomUtils/LoaderComp';

//styles
const LoaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;

const StyledModal = styled(Modal)`
  .modal-content {
    padding: 0;
    border: none;
    border-radius: 8px;
    overflow: hidden;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    max-width: ${props => props.isMobile ? '300px' : '600px'};
    max-height: ${props => props.isMobile ? '400px' : '300px'};
    margin: 0 auto;
  }
  .modal-body {
    padding: 0;
    width: 100%;
    height: auto;
  }
  .welcome-image {
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block;
    cursor: pointer;
  }
  .close-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #fff;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    padding: 5px;
    z-index: 1;
    font-size: 24px;
  }
`;

//cache keys
const CACHE_KEY = 'modalDataCache';
const MODAL_VISIBILITY_KEY = 'modalLastClosed';
const CACHE_EXPIRY = 3600000; // 1 hour

const ShowWelcomeModal = () => {
    const { api, isMobile } = useMyContext();
    const [modalData, setModalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(() => {
        const lastClosed = localStorage.getItem(MODAL_VISIBILITY_KEY);
        if (lastClosed) {
            const timePassed = Date.now() - parseInt(lastClosed);
            return timePassed >= CACHE_EXPIRY;
        }
        return true;
    });

    const handleClose = () => {
        localStorage.setItem(MODAL_VISIBILITY_KEY, Date.now()?.toString());
        setShow(false);
    };

    useEffect(() => {
        if (!show) return;

        const fetchData = async () => {
            try {
                let data = null;
                const cachedData = localStorage.getItem(CACHE_KEY);

                if (cachedData) {
                    const cached = JSON.parse(cachedData);
                    if (Date.now() - cached.timestamp <= CACHE_EXPIRY) {
                        data = cached.data;
                    }
                }

                if (!data) {
                    const response = await axios.get(`${api}wc-mdl-list`);
                    if (response.data?.status && response.data.data) {
                        data = response.data.data;
                        localStorage.setItem(CACHE_KEY, JSON.stringify({
                            data,
                            timestamp: Date.now()
                        }));
                    } else {
                        // Clear cache if no valid data received
                        localStorage.removeItem(CACHE_KEY);
                        localStorage.removeItem(MODAL_VISIBILITY_KEY);
                    }
                }

                // If no data or invalid data, clear cache
                if (!data?.image || !data?.sm_image) {
                    localStorage.removeItem(CACHE_KEY);
                    localStorage.removeItem(MODAL_VISIBILITY_KEY);
                }

                setModalData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                // Clear cache on error
                localStorage.removeItem(CACHE_KEY);
                localStorage.removeItem(MODAL_VISIBILITY_KEY);
                setLoading(false);
            }
        };

        fetchData();
    }, [api, show]);

    const handleImageLoad = () => {
        setLoading(false);
    };

    const handleImageClick = () => {
        const url = isMobile ? modalData?.sm_url : modalData?.url;
        if (url) {
            window.open(url, '_blank');
        }
        handleClose();
    };

    if (!show || (!loading && (!modalData?.image || !modalData?.sm_image))) return null;

    return (
        <>
            {loading && (
                <LoaderWrapper>
                    <LoaderComp />
                </LoaderWrapper>
            )}
            {modalData && (
                <StyledModal
                    show={show}
                    onHide={handleClose}
                    centered
                    size="lg"
                    isMobile={isMobile}
                >
                    <IoClose className="close-icon" onClick={handleClose} />
                    <Modal.Body>
                        <Image
                            src={isMobile ? modalData.sm_image : modalData.image}
                            alt="Welcome"
                            className="welcome-image"
                            onClick={handleImageClick}
                            onLoad={handleImageLoad}
                            style={{ display: loading ? 'none' : 'block' }}
                        />
                    </Modal.Body>
                </StyledModal>
            )}
        </>
    );
};

export default ShowWelcomeModal;

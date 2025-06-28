import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useMyContext } from "../../../../Context/MyContextProvider";
import IdCardCanvas from './IdCardCanvas';

const IdCardModal = ({ show, onHide, id, idCardData, bgRequired,zones }) => {
  const { api, authToken } = useMyContext();
  const [finalImage, setFinalImage] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userImage, setUserImage] = useState(null);


  useEffect(() => {
    if (show && id) {
      setLoading(true);
      setOrderId(idCardData?.order_id || null);
      FetchImageBlob(idCardData?.photo, setUserImage);
      FetchImageBlob(idCardData?.background_image, setFinalImage);
    }
  }, [show, id]);

  const FetchImageBlob = async (imageUrl, setState) => {
    try {
      const res = await axios.post(
        `${api}get-image/retrive/data`,
        { path: imageUrl },
        {
          responseType: 'blob',
          headers: {
            Authorization: "Bearer " + authToken,
          },
        }
      );
      const imageBlob = res.data;
      const url = URL.createObjectURL(imageBlob);
      setState(url);
    } catch (error) {
      console.error("Error fetching image:", error);
      setState(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      if (finalImage) {
        URL.revokeObjectURL(finalImage);
      }
    };
  }, [finalImage]);

  // make function to reset all states
  const resetStates = () => {
    setFinalImage(null);
    setOrderId(null);
    setUserImage(null);
    setLoading(false);
  };
  //make handleclose function to reset states and also  destroy the modal 
  const handleClose = () => {
    setTimeout(() => {
      resetStates();
    }, 1000);
    onHide();
  };
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Preview ID Card</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <IdCardCanvas
          loading={loading}
          bgRequired={bgRequired}
          finalImage={finalImage}
          userImage={userImage}
          orderId={orderId}
          zones={zones}
          userData={idCardData}
        />
      </Modal.Body>
    </Modal>
  );
};

export default IdCardModal;
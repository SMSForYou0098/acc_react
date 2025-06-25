import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useMyContext } from "../../../../Context/MyContextProvider";
import IdCardCanvas from './IdCardCanvas';

const IdCardModal = ({ show, onHide, id, idCardData }) => {
  const { api, authToken } = useMyContext();
  const [imageData, setImageData] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [userData, setUserData] = useState(null);

  const getData = async () => {
    if (!id) return;

    try {
      const response = await axios.get(
        `${api}get-image/${id}`,

        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
        }
      );

      const data = response.data;
      setImageData(data);
      setOrderId(data.token );

      if (data.token && data.data) {
        const retriveRes = await axios.post(
          `${api}get-image/retrive/data`,
          { path: data.data },
          {
            responseType: 'blob',
            headers: {
              Authorization: "Bearer " + authToken,
            },
          }
        );

        const imageBlob = retriveRes.data;
        const imageUrl = URL.createObjectURL(imageBlob);
        setFinalImage(imageUrl);
      }

    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };
  useEffect(() => {
    if (show && id) {
      getData();
    }
  }, [show, id]);

  useEffect(() => {
    return () => {
      if (finalImage) {
        URL.revokeObjectURL(finalImage);
      }
    };
  }, [finalImage]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Preview ID Card</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <IdCardCanvas 
          finalImage={finalImage} 
          orderId={orderId}
          userData={idCardData}
        />
      </Modal.Body>
    </Modal>
  );
};

export default IdCardModal;
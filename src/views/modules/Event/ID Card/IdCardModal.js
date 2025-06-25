import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useMyContext } from "../../../../Context/MyContextProvider";
import IdCardCanvas from './IdCardCanvas';

const IdCardModal = ({ show, onHide, id, idCardData, bgRequired }) => {
  const { api, authToken } = useMyContext();
  const [finalImage, setFinalImage] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const getData = async () => {
    if (!id) return;
    setLoading(true);
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
      setOrderId(data.token);

      if (data.token && data.data) {
        FetchImageBlob(idCardData?.photo, setUserImage);
        FetchImageBlob(data.data, setFinalImage);
      }

    } catch (error) {
      console.error('Error fetching image:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show && id) {
      getData();
    }
  }, [show, id]);

  const FetchImageBlob = async (imageUrl, setState) => {
    const retriveRes = await axios.post(
      `${api}get-image/retrive/data`,
      { path: imageUrl },
      {
        responseType: 'blob',
        headers: {
          Authorization: "Bearer " + authToken,
        },
      }
    );

    const imageBlob = retriveRes.data;
    const url = URL.createObjectURL(imageBlob);
    setState(url);
  }

  useEffect(() => {
    return () => {
      if (finalImage) {
        URL.revokeObjectURL(finalImage);
      }
    };
  }, [finalImage]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
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
          userData={idCardData}
        />
      </Modal.Body>
    </Modal>
  );
};

export default IdCardModal;
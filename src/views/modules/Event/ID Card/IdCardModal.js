import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useMyContext } from "../../../../Context/MyContextProvider";
import IDCardDragAndDrop from './IDCardDragAndDrop';

export const FetchImageBlob = async (api, setLoading, imageUrl, setState) => {

  if (!imageUrl) {
    setState(null);
    setLoading(false);
    return;
  }

  try {
    const res = await axios.post(
      `${api}get-image/retrive/data`,
      { path: imageUrl },
      { responseType: 'blob' }
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
const IdCardModal = ({ show, onHide, id, idCardData, bgRequired, zones }) => {
  const { api, authToken, UserPermissions } = useMyContext();
  const [finalImage, setFinalImage] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userImage, setUserImage] = useState(null);
const [savedLayout, setSavedLayout] = useState();
  const [fetchingLayout, setFetchingLayout] = useState(true);
  const [isCircle, setIsCircle] = useState(false);

  useEffect(() => {
    if (show && id) {
      setLoading(true);
      setOrderId(idCardData?.order_id || null);
      FetchImageBlob(api, setLoading, idCardData?.photo, setUserImage);
      FetchImageBlob(api, setLoading, idCardData?.background_image, setFinalImage);
    }
  }, [show, id]);



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

  useEffect(() => {
    if (!orderId || !idCardData) {
      setFetchingLayout(false);
      return;
    }

    const fetchLayout = async () => {
      try {
        setFetchingLayout(true);
        const response = await axios.get(
          `${api}get-layout/${idCardData?.category_id}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const data = response.data;
        if (data.status && data.data) {
          const parsed = data.data;

          const transformedLayout = {
            userPhoto: JSON.parse(parsed.user_photo || "{}"),
            textValue_0: JSON.parse(parsed.text_1 || "{}"),
            textValue_1: JSON.parse(parsed.text_2 || "{}"),
            textValue_2: JSON.parse(parsed.text_3 || "{}"),
            qrCode: JSON.parse(parsed.qr_code || "{}"),
            zoneGroup: JSON.parse(parsed.zones || "{}"),
          };

          setSavedLayout(transformedLayout);
          setIsCircle(transformedLayout.userPhoto?.isCircle || false);
        }
      } catch (error) {
        console.error("Failed to fetch layout:", error);
      } finally {
        setFetchingLayout(false);
      }
    };

    fetchLayout();
  }, [orderId]);
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Preview ID Card</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <IDCardDragAndDrop
          loading={loading}
          bgRequired={bgRequired}
          finalImage={finalImage}
          userImage={userImage}
          orderId={orderId}
          zones={zones}
          userData={idCardData}
          animate={false}
          isEdit={false}
          download={UserPermissions.includes("Download Id Card")}
          print={UserPermissions.includes("Print Id Card")}
          fetchingLayout={fetchingLayout}
          savedLayout={savedLayout}
          isCircle={isCircle}
        />
      </Modal.Body>
    </Modal>
  );
};

export default IdCardModal;
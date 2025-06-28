import axios from "axios";
import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useMyContext } from "../../../../Context/MyContextProvider";
import { FetchImageBlob } from "../ID Card/IdCardModal";
import { Card } from "react-bootstrap";
import IdCardCanvas from "../ID Card/IdCardCanvas";

const UserCard = () => {
  const { api, ErrorAlert } = useMyContext();
  const { orderId } = useParams();
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const getCardData = useCallback(async () => {
    if (!orderId) {
      ErrorAlert("Order ID not found");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${api}gan-card/${orderId}`);
      if (response.data.status) {
        setCardData(response.data.data);
      } else {
        ErrorAlert("No data found for this order ID");
      }
    } catch (error) {
      const err =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetch card data";
      ErrorAlert(err);
    } finally {
      setLoading(false);
    }
  }, [api, orderId, ErrorAlert]);
  useEffect(() => {
    if (cardData) {
      const userImage = cardData?.photo;
      const bgimage = cardData?.company?.category_id?.background_image;
      
      if (userImage) {
        FetchImageBlob(api, setLoading, userImage, setUserImage);
      }
      if (bgimage) {
        FetchImageBlob(api, setLoading, bgimage, setFinalImage);
      }
    }
  }, [api, cardData]);

  useEffect(() => {
    if (orderId) {
      getCardData();
    } else {
      ErrorAlert("Order ID not found");
    }
  }, [orderId, getCardData, ErrorAlert]);

  return (
    <>
      {cardData && (
        <Card className="p-3">
          <IdCardCanvas
            loading={loading}
            bgRequired={true}
            finalImage={finalImage}
            userImage={userImage}
            orderId={cardData?.orderId}
            zones={cardData?.zone}
            userData={cardData}
            hidePrint={true}
          />
        </Card>
      )}
    </>
  );
};

export default UserCard;

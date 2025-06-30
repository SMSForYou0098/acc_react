import axios from "axios";
import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useMyContext } from "../../../../Context/MyContextProvider";
import { FetchImageBlob } from "../ID Card/IdCardModal";
import { Card, Alert, Spinner, Container } from "react-bootstrap";
import IdCardCanvas from "../ID Card/IdCardCanvas";

const UserCard = () => {
  const { api, ErrorAlert } = useMyContext();
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  const getCardData = useCallback(async () => {
    if (!orderId) {
      const msg = "Order ID not found";
      setErrorMsg(msg);
      ErrorAlert(msg);
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.get(`${api}gan-card/${orderId}`);
      if (response.data.status) {
        setCardData(response.data.data);
        setErrorMsg("");
      } else {
        const msg = "No data found for this order ID";
        setErrorMsg(msg);
        ErrorAlert(msg);
      }
    } catch (error) {
      const err =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetch card data";
      setErrorMsg(err);
      ErrorAlert(err);
    } finally {
      setLoading(false);
    }
  }, [api, orderId, ErrorAlert]);

  useEffect(() => {
    if (cardData) {
      setImageLoading(true);
      const userImage = cardData?.photo;
      const bgimage = cardData?.company?.category_id?.background_image;

      const fetchImages = async () => {
        try {
          if (userImage) {
            await FetchImageBlob(api, setImageLoading, userImage, setUserImage);
          }
          if (bgimage) {
            await FetchImageBlob(api, setImageLoading, bgimage, setFinalImage);
          }
        } catch (error) {
          console.error("Error loading images:", error);
        } finally {
          setImageLoading(false);
        }
      };

      fetchImages();
    }
  }, [api, cardData]);

  useEffect(() => {
    getCardData();
  }, [getCardData]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f8f9fa"
    }}>
      <Container style={{ maxWidth: "800px" }}>
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" size="lg" />
            <h5 className="mt-3 text-primary">Loading card data...</h5>
          </div>
        )}

        {!loading && errorMsg && (
          <Alert variant="danger" className="text-center">
            <Alert.Heading>Error Loading Card</Alert.Heading>
            <p>{errorMsg}</p>
            <hr />
            <p className="mb-0">
              Please check the order ID and try again.
            </p>
          </Alert>
        )}

        {!loading && cardData && (
          <Card className="shadow-sm" style={{ margin: "auto" }}>
            <Card.Header className="bg-primary text-white text-center">
              <h4 className="mb-0">ID Card Preview</h4>
            </Card.Header>
            <Card.Body className="text-center p-4">
              {(imageLoading || !userImage || !finalImage) ? (
                <div className="py-5">
                  <Spinner animation="border" variant="secondary" />
                  <p className="mt-2">Preparing card design...</p>
                </div>
              ) : (
                <IdCardCanvas
                  loading={imageLoading}
                  bgRequired={true}
                  finalImage={finalImage}
                  userImage={userImage}
                  orderId={cardData?.orderId}
                  zones={cardData?.zone}
                  userData={cardData}
                  hidePrint={true}
                />
              )}
            </Card.Body>
            <Card.Footer className="text-muted small text-center">
              Order ID: {orderId}
            </Card.Footer>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default UserCard;
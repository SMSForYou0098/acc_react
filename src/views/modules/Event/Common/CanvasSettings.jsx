import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import IDCardDragAndDrop from '../ID Card/IDCardDragAndDrop';
import profileImage from '../../../../assets/event/stock/profile.jpg';
import { FetchImageBlob } from '../ID Card/IdCardModal';
import { useMyContext } from '../../../../Context/MyContextProvider';

const CanvasSettings = ({ previewUrl }) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { api } = useMyContext();
  const [finalImage, setFinalImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCircle, setIsCircle] = useState(true); // For image style

  const [dummyUserData, setDummyUserData] = useState({
    name: "John Doe",
    company_name: "Example Corp",
    designation: "Software Engineer",
  });

  useEffect(() => {
    setLoading(true);
    const fetchImages = async () => {
      await Promise.all([
        FetchImageBlob(api, setLoading, previewUrl, setFinalImage),
      ]);
    };
    fetchImages();
  }, [previewUrl, api]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDummyUserData((prev) => ({ ...prev, [name]: value }));
  };

  console.log("Final Image:", finalImage);

  return (
    <>
      {finalImage && (
        <div className="d-flex justify-content-center">
          <Button
            variant="outline-primary"
            onClick={() => setShowSettingsModal(true)}
            className="mt-2"
          >
            Open Settings
          </Button>
        </div>
      )}

      <Modal
        show={showSettingsModal}
        onHide={() => setShowSettingsModal(false)}
        size="xl"
        centered
        dialogClassName="custom-modal"
        backdrop="static"
      >
        <Modal.Header closeButton className="sticky-top bg-white z-3">
          <Modal.Title>ID Card Layout Editor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* Left Column: Form controls */}
            <Col md={4}>
              <h5>User Info</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={dummyUserData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    type="text"
                    name="company_name"
                    value={dummyUserData.company_name}
                    onChange={handleInputChange}
                    placeholder="Enter company"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    name="designation"
                    value={dummyUserData.designation}
                    onChange={handleInputChange}
                    placeholder="Enter designation"
                  />
                </Form.Group>

                <Form.Check
                  type="switch"
                  id="circle-image-switch"
                  label="Show user image in circle"
                  checked={isCircle}
                  onChange={() => setIsCircle((prev) => !prev)}
                />
              </Form>
            </Col>

            {/* Right Column: Canvas Editor */}
            <Col md={8}>
              <IDCardDragAndDrop
                finalImage={finalImage}
                userImage={profileImage}
                orderId="d$NzCUtf"
                bgRequired={true}
                zones={[]}
                userData={dummyUserData}
                isEdit={true}
                isCircle={isCircle}
              />
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CanvasSettings;

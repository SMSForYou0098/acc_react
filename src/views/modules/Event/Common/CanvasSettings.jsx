import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import IDCardDragAndDrop from "../ID Card/IDCardDragAndDrop";
import profileImage from "../../../../assets/event/stock/profile.jpg";
import { FetchImageBlob } from "../ID Card/IdCardModal";
import { useMyContext } from "../../../../Context/MyContextProvider";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignVerticalSpaceAround,
  Check,
  Info,
  MousePointer,
  Move,
  RotateCcw,
  Save,
  Settings,
} from "lucide-react";
import ImageStyleSelector from "./ImageStyleSelector";

const CanvasSettings = ({ previewUrl, setLayoutData, categoryId }) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { api } = useMyContext();
  const [finalImage, setFinalImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCircle, setIsCircle] = useState(true); // For image style
  const [zones, setZones] = useState([
    {
      id: 1,
      name: "Zone 1",
    },
    {
      id: 2,
      name: "Zone 2",
    },
    {
      id: 3,
      name: "Zone 3",
    },
    {
      id: 4,
      name: "Zone 4",
    },
    {
      id: 5,
      name: "Zone 5",
    },
  ]); // Assuming zones are not used in this component
  const instruction = [
    {
      Icon: Move,
      text: "Drag and drop elements to rearrange their position",
    },
    {
      Icon: MousePointer,
      text: "Hold Shift key and click to select multiple elements",
    },
    {
      Icon: Settings,
      text: "Use the settings panel to modify styles and appearance",
    },
    {
      Icon: RotateCcw,
      text: "Use Ctrl+Z to undo recent changes",
    },
    {
      Icon: Save,
      text: "Changes are saved automatically",
    },
    {
      Icon: AlignCenter,
      text: "Press Ctrl+E to horizontally center selected element",
    },
    {
      Icon: AlignVerticalSpaceAround,
      text: "Press Ctrl+Q to vertically center selected element",
    },
    // {
    //   Icon: AlignHorizontalSpaceAround,
    //   text: "Press Ctrl+W to center selected element both horizontally and vertically",
    // },
    {
      Icon: AlignLeft,
      text: "Press Ctrl+1 to align selected element to left third line",
    },
    {
      Icon: AlignRight,
      text: "Press Ctrl+2 to align selected element to right third line",
    },
  ];

  const [dummyUserData, setDummyUserData] = useState({
    name: "Your name",
    company_name: "Your Company name",
    designation: "Your designation",
    company: { zone: [2, 3, 5] },
  });

  useEffect(() => {
    setLoading(true);

    // Check if previewUrl is already a blob URL
    if (previewUrl && previewUrl.startsWith("blob:")) {
      setFinalImage(previewUrl);
      setLoading(false);
      return;
    }

    const fetchImages = async () => {
      await Promise.all([
        FetchImageBlob(api, setLoading, previewUrl, setFinalImage),
      ]);
    };

    if (previewUrl) {
      fetchImages();
    } else {
      setLoading(false);
    }
  }, [previewUrl, api]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDummyUserData((prev) => ({ ...prev, [name]: value }));
  };
  const handleZoneClick = (zoneId) => {
    const isAlreadySelected = dummyUserData.company.zone.includes(zoneId);

    const updatedZones = isAlreadySelected
      ? dummyUserData.company.zone.filter((id) => id !== zoneId)
      : [...dummyUserData.company.zone, zoneId];

    setDummyUserData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        zone: updatedZones,
      },
    }));
  };
  return (
    <>
      {previewUrl && (
        <div className="d-flex justify-content-between w-100 align-items-center px-4">
          <h6 className="p-0 m-0">ID Card Preview</h6>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setShowSettingsModal(true)}
            className="d-flex align-items-center gap-2"
          >
            <Settings size={16} />
            Settings
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
            <Col md={6}>
              <h5>User Info</h5>
              <Form>
                <Row>
                  <Col xs={6} className="mb-3">
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
                  </Col>
                  <Col xs={6} className="mb-3">
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
                  </Col>
                  <Col xs={6} className="mb-3">
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
                  </Col>
                  <Col xs={12} className="mb-3">
                    <ImageStyleSelector
                      isCircle={isCircle}
                      setIsCircle={setIsCircle}
                    />
                  </Col>
                </Row>
                <h6 className="mb-3">Zone Access</h6>
                <Row>
                  {zones.map((zone) => {
                    const isSelected = dummyUserData.company.zone.includes(
                      zone.id
                    );

                    return (
                      <Col key={zone.id} xs={6} sm={4} md={3} className="mb-3">
                        <Button
                          variant={
                            isSelected ? "outline-success" : "outline-secondary"
                          }
                          className="w-100 rounded-3 d-flex justify-content-between align-items-center px-3 py-2"
                          onClick={() => handleZoneClick(zone.id)}
                        >
                          <span className="small">{zone.name}</span>
                          {isSelected && <Check size={18} />}
                        </Button>
                      </Col>
                    );
                  })}
                </Row>
                
              </Form>
              <div className="p-3 rounded-3 border">
                <h6 className="text-primary mb-3 fw-semibold">
                  <Info size={16} className="me-2" />
                  Editor Instructions
                </h6>
                <ul className="list-unstyled mb-0">
                  {instruction.map((instruction, index) => (
                    <li
                      key={index}
                      className="mb-2 d-flex align-items-center gap-2"
                    >
                      <instruction.Icon size={14} className="text-secondary" />
                      <span>{instruction.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
            {/* Right Column: Canvas Editor */}
            <Col md={6}>
              <IDCardDragAndDrop
                finalImage={finalImage}
                userImage={profileImage}
                orderId="d$NzCUtf"
                bgRequired={true}
                zones={zones}
                userData={dummyUserData}
                isEdit={true}
                isCircle={isCircle}
                setShowSettingsModal={setShowSettingsModal}
                setLayoutData={setLayoutData}
                categoryId={categoryId}
              />
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CanvasSettings;

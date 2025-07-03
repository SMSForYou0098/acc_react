import { X } from "lucide-react";
import React from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const CustomImagePreview = (props) => {
  const { showPreviewModal, setShowPreviewModal, src, link } = props;
  return (
    <Modal
      show={showPreviewModal}
      onHide={() => setShowPreviewModal(false)}
      size="lg"
      centered
    >
      <Modal.Body className="p-0 position-relative">
        <Button
          variant="link"
          className="position-absolute top-0 end-0 p-2 text-white"
          onClick={() => setShowPreviewModal(false)}
          style={{
            zIndex: 1050,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "0 0 0 8px",
          }}
        >
          <X size={20} />
        </Button>
        {src && (
          <Row>
            <Col md="12">
              <a href={link || "#"} target="_blank" rel="noreferrer" className="text-decoration-none">
                <img
                  src={src || "/placeholder-image.jpg"}
                  alt="Small Modal Preview"
                  className="img-fluid rounded"
                  style={{ width: "100%", height: "auto" }}
                />
              </a>
            </Col>
          </Row>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CustomImagePreview;

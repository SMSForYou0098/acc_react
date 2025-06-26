import React from "react";
import { Button, Modal } from "react-bootstrap";
import ZonesPreview from "./ZonesPreview";

const ZonePreviewModal = ({zoneModal,zones,setZoneModal}) => {
  return (
    <Modal
      show={zoneModal.show}
      onHide={() =>
        setZoneModal({ show: false, user: null, assignedZoneIds: [] })
      }
      centered
      size="md"
      className="zone-modal"
    >
      <Modal.Body className="py-4">
        <ZonesPreview
          zones={zones}
          assignedZoneIds={zoneModal?.assignedZoneIds}
          name={zoneModal?.user?.name}
        />
      </Modal.Body>

      <Modal.Footer className="justify-content-center border-0 pt-0">
        <Button
          variant="primary"
          className="px-4"
          onClick={() =>
            setZoneModal({ show: false, user: null, assignedZoneIds: [] })
          }
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ZonePreviewModal;

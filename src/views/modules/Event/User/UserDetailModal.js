import React from "react";
import { CheckCircle, Clock, User, XCircle, X, Mail, Phone, Shield, Key, Building, Briefcase, Users, Calendar, RefreshCw, Info, Image, FileText, ExternalLink } from "lucide-react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { useMyContext } from "../../../../Context/MyContextProvider";
import { motion } from "framer-motion";
import ZonesPreview from "./ZonesPreview";
import CustomImage from "../Utils/CustomImage";
import { capitalize } from "lodash";

export const Section = ({ title, color, icon, children }) => (
  <div className="mb-4 shadow-sm rounded-4 overflow-hidden">
    <div
      className={`bg-${color} text-white px-3 py-2 d-flex align-items-center`}
    >
      {icon}
      <h6 className="mb-0 fw-semibold text-white ms-2">{title}</h6>
    </div>
    <div className="p-4 bg-white border-top border-light-subtle">
      {children}
    </div>
  </div>
);

const UserDetailModal = (props) => {
  const { 
    showModal = true, 
    setShowModal, 
    selectedUser, 
    zones, 
    asDiv = false // New prop to determine if we should render as div
  } = props;
  
  const { formatDateTime } = useMyContext();

  const InfoCol = (label, value, icon, grid = 6) => (
    <Col md={grid}>
      <div className="small mb-1 d-flex align-items-center gap-2">
        {icon} {label}:
      </div>
      <div className="fw-semibold text-dark fs-6">{value}</div>
    </Col>
  );

  const renderStatusBadge = (status) => {
    const statusMap = {
      0: {
        text: "Pending",
        class: "bg-warning",
        icon: <Clock size={14} className="me-1" />,
      },
      1: {
        text: "Approved",
        class: "bg-success",
        icon: <CheckCircle size={14} className="me-1" />,
      },
      2: {
        text: "Rejected",
        class: "bg-danger",
        icon: <XCircle size={14} className="me-1" />,
      },
    };

    const { text, class: className, icon } = statusMap[status] || {};
    return (
      <span
        className={`badge ${className} d-inline-flex align-items-center px-2 py-1`}
      >
        {icon} {text}
      </span>
    );
  };

  // Content that will be rendered in both modal and div versions
  const renderContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
       style={{maxHeight:'680px', overflowY: 'auto'}}
    >
      {selectedUser ? (
        <div className="py-3">
          {/* Basic Information */}
          <Section
            title="Basic Information"
            color="primary"
            icon={<Info size={18} />}
          >
            <Row className="gy-4">
              {/* User Photo */}
              {selectedUser.photo && (
                <Col md={2}>
                  <CustomImage
                    width={'100%'}
                    height="auto"
                    src={selectedUser.photo}
                    alt="User Profile"
                  />
                </Col>
              )}
              {/* User Details */}
              <Col md={10}>
                <Row className="gy-4">
                  {InfoCol("Name", selectedUser.name, <User size={16} />, 4)}
                  {InfoCol("Email", selectedUser.email, <Mail size={16} />, 4)}
                  {InfoCol(
                    "Contact",
                    selectedUser?.contact || selectedUser?.number,
                    <Phone size={16} />,
                    4
                  )}
                  {InfoCol(
                    "Role",
                    selectedUser?.role_name || selectedUser?.role.name,
                    <Shield size={16} />,
                    4
                  )}
                  {InfoCol(
                    "Authentication",
                    parseInt(selectedUser?.authentication) === 1
                      ? "Password"
                      : "OTP",
                    <Key size={16} />,
                    4
                  )}
                  <Col md={4}>
                    <div className="text-muted small d-flex align-items-center gap-2">
                      <Clock size={16} /> Status:
                    </div>
                    <div className="my-2">{renderStatusBadge(selectedUser.approval_status)}</div>
                  </Col>
                  {
                    selectedUser?.role_name === 'User' &&  
                  InfoCol(
                    "Desgination",
                    capitalize(selectedUser?.designation),
                    <User size={16} />,
                    4
                  )
                  }
                  {/* Photo ID Document */}
                  {selectedUser?.photo_id && (
                    <Col md={4}>
                      <div className=" small d-flex align-items-center gap-2 mb-2">
                        <FileText size={16} /> Identity Document:
                      </div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="d-inline-flex align-items-center"
                        onClick={() => window.open(selectedUser.photo_id, '_blank')}
                      >
                        <ExternalLink size={16} className="me-2" />
                        View Document
                      </Button>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          </Section>

          {/* Organization Details */}
            <Section
              title="Organization Details"
              color="danger"
              icon={<Building size={18} />}
            >
              <Row className="gy-3">
                {InfoCol(
                  "Company Name",
                  selectedUser?.user_comp || selectedUser?.company?.company_name ||"N/A",
                  <Briefcase size={16} />,4
                )}
                {InfoCol(
                  "Contact Person",
                  selectedUser?.role_name === "Organizer" ? selectedUser?.name : selectedUser?.company?.name || "N/A",
                  <Users size={16} />,4
                )}
                {InfoCol(
                  "Contact Number",
                  selectedUser?.role_name === "Organizer" ? selectedUser?.contact :selectedUser?.company?.number || "N/A",
                  <Users size={16} />,4
                )}
              </Row>
            </Section>

          {/* Zone Selection */}
          {(selectedUser?.role_name === 'Company' || (selectedUser?.role?.name  === 'User' || selectedUser?.role_name === 'User' )) &&
            <ZonesPreview zones={zones} assignedZoneIds={selectedUser?.company?.zone} />
          }

          {/* Additional Info */}
          <Section
            title="Additional Information"
            color="secondary"
            icon={<Info size={18} />}
          >
            <Row className="gy-3">
              {InfoCol(
                "Registered At",
                formatDateTime(selectedUser.created_at),
                <Calendar size={16} />
              )}
            </Row>
          </Section>
        </div>
      ) : (
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2 d-flex align-items-center justify-content-center gap-2">
            <RefreshCw size={16} className="animate-spin" /> Loading user
            details...
          </p>
        </div>
      )}
    </motion.div>
  );

  // Footer content
  const renderFooter = () => (
    <div className="border-top-0 pt-0 d-flex justify-content-end gap-2">
      {setShowModal && (
        <Button
          variant="outline-secondary"
          onClick={() => setShowModal(false)}
          className="d-inline-flex align-items-center"
        >
          <X size={16} className="me-2" /> Close
        </Button>
      )}

    </div>
  );

  if (asDiv) {
    return (
      <div className="bg-white rounded-4 shadow-lg p-4">
        <div className="d-flex align-items-center gap-2 fw-bold text-primary fs-4 mb-3">
          <User size={20} className="me-1" /> User Profile
        </div>
        {renderContent()}
        {renderFooter()}
      </div>
    );
  }

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal && setShowModal(false)}
      size="lg"
      centered
      contentClassName="border-0 shadow-lg rounded-4"
      dialogClassName="modal-dialog-scrollable"
    >
      <Modal.Header className="border-bottom-0 pb-0" closeButton>
        <Modal.Title className="d-flex align-items-center gap-2 fw-bold text-primary fs-4">
          <User size={20} className="me-1" /> User Profile
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pt-0">
        {renderContent()}
      </Modal.Body>
      <Modal.Footer className="border-top-0 pt-0">
        {renderFooter()}
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailModal;
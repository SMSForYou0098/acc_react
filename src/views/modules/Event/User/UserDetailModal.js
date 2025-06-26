import React, { useMemo } from "react";
import { CheckCircle, Clock, User, XCircle, Check, X, MapPin, Mail, Phone, Shield, Key, Building, Briefcase, Users, Calendar, RefreshCw, Info } from "lucide-react";
import { Button, Col, Modal, Row, Badge } from "react-bootstrap";
import { useMyContext } from "../../../../Context/MyContextProvider";
import { motion } from "framer-motion";
import ZonesPreview from "./ZonesPreview";

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
  const { showModal, setShowModal, selectedUser, handleApproval, zones, assignedZoneIds } = props;
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

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
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
                  {InfoCol("Name", selectedUser.name, <User size={16} />, 4)}
                  {InfoCol("Email", selectedUser.email, <Mail size={16} />, 4)}
                  {InfoCol(
                    "Contact",
                    selectedUser.contact,
                    <Phone size={16} />,
                    4
                  )}
                  {InfoCol(
                    "Role",
                    selectedUser?.role_name,
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
                    <div className="my-2">{renderStatusBadge(selectedUser.status)}</div>
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
                    "Organisation",
                    selectedUser?.organisation?.name || "N/A",
                    <Building size={16} />
                  )}
                  {InfoCol(
                    "Company Name",
                    selectedUser?.comp_name || "N/A",
                    <Briefcase size={16} />
                  )}
                  {InfoCol(
                    "Organiser",
                    selectedUser.org_name || "N/A",
                    <Users size={16} />
                  )}
                </Row>
              </Section>

              {/* Zone Selection */}
              {selectedUser?.role_name === 'Company' &&
                <ZonesPreview zones={zones} assignedZoneIds={assignedZoneIds} />
              }

              {/* Additional Info */}
              <Section
                title="Additional Information"
                color="secondary"
                icon={<Info size={18} />}
              >
                <Row className="gy-3">
                  {InfoCol(
                    "Created At",
                    formatDateTime(selectedUser.created_at),
                    <Calendar size={16} />
                  )}
                  {InfoCol(
                    "Updated At",
                    formatDateTime(selectedUser.updated_at) || "N/A",
                    <RefreshCw size={16} />
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
      </Modal.Body>
      <Modal.Footer className="border-top-0 pt-0">
        <Button
          variant="outline-secondary"
          onClick={() => setShowModal(false)}
          className="d-inline-flex align-items-center"
        >
          <X size={16} className="me-2" /> Close
        </Button>
        {selectedUser && selectedUser.status === 0 && (
          <>
            <Button
              variant="success"
              className="d-inline-flex align-items-center"
              onClick={() => {
                handleApproval(selectedUser.id, "1");
                setShowModal(false);
              }}
            >
              <CheckCircle size={16} className="me-2" /> Approve
            </Button>
            <Button
              variant="danger"
              className="d-inline-flex align-items-center"
              onClick={() => {
                handleApproval(selectedUser.id, "2");
                setShowModal(false);
              }}
            >
              <XCircle size={16} className="me-2" /> Reject
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailModal;

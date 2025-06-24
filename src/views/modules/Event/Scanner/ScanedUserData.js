import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Image, Modal, Row } from 'react-bootstrap'
import { User, AtSign, Phone, Briefcase, Shield } from 'lucide-react';

const ScanedUserData = (props) => {
  const { show, iDCardData, setShow, handleVerify } = props;

  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    setHasData(!!iDCardData && Object.keys(iDCardData || {})?.length > 0);
  }, [iDCardData]);

  const fields = [
    {
      label: "Name",
      icon: <User size={20} />,
      value: iDCardData?.user_name || 'N/A',
    },
    {
      label: "Role",
      icon: <Shield size={20} />,
      value: iDCardData?.role || 'N/A',
    },
    {
      label: "Company Name",
      icon: <Briefcase size={20} />,
      value: iDCardData?.company_user?.name || 'N/A',
    },
    {
      label: "Company Email",
      icon: <AtSign size={20} />,
      value: iDCardData?.company_user?.email || 'N/A',
    },
    {
      label: "Organizer Name",
      icon: <User size={20} />,
      value: iDCardData?.organizer_user?.name || 'N/A',
    },
    {
      label: "Organizer Email",
      icon: <AtSign size={20} />,
      value: iDCardData?.organizer_user?.email || 'N/A',
    },
  ];

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="justify-content-center">
        <Modal.Title className="text-center w-100">
          User Information
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="shadow-none mb-0">
          <Card.Body>
            <Row>
              {fields?.map((field, index) => (
                <Col key={index} xs={12} md={6} className="mb-3">
                  <div className="d-flex gap-3 align-items-center border-bottom pb-2">
                    <span className="text-dark">{field.icon}</span>
                    <div>
                      <p className="mb-0 fw-semibold text-secondary">{field.label}</p>
                      <h5 className="mb-0 text-primary">{field.value}</h5>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button
          onClick={() => handleVerify()}
          size="lg"
          className="rounded-circle p-0 fs-2 d-flex justify-content-center align-items-center"
          style={{ width: "120px", height: "120px", minWidth: "120px" }}
        >
          Verify
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScanedUserData;

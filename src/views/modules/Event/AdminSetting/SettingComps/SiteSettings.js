import React, { useEffect, useState } from "react";
import { Col, Form, Image, Row, Spinner,Placeholder, Card } from "react-bootstrap";

const inputConfig = {
  fileInputs: [
    { label: "Logo", key: "logo" },
    { label: "Mobile Logo", key: "mobileLogo" },
    { label: "Auth Logo", key: "authLogo" },
    { label: "Favicon", key: "favicon", accept: "*" }
  ],
  textInputs: [
    { label: "App Name", key: "appName", type: "text", placeholder: "App name" },
    { label: "WhatsApp Number", key: "waNumber", type: "number" },
    { label: "Missed Call Number", key: "missedCallNumber", type: "number" }
  ],
  switches: [
    { label: "User Notification Permission", key: "notifyReq", col: 3 },
    { label: "Welcome Modal Status", key: "isModalEnabled", col: 3 },
    { label: "Compress Image", key: "compressImage", col: 4 }
  ]
};

const SiteSettings = ({ settings = {}, onSettingChange, loading = false }) => {
  const [previews, setPreviews] = useState({});

  // Sync previews when settings change
  useEffect(() => {
    const newPreviews = {};
    inputConfig.fileInputs.forEach(({ key }) => {
      if (settings[key]) {
        newPreviews[key] = { uri: settings[key], isUrl: true };
      }
    });
    setPreviews(newPreviews);
  }, [settings]);

  const handleFileChange = (file, key) => {
    onSettingChange(key, file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [key]: { uri: reader.result, isUrl: false } }));
      };
      reader.readAsDataURL(file);
    } else {
      setPreviews(prev => ({
        ...prev,
        [key]: settings[key] ? { uri: settings[key], isUrl: true } : null
      }));
    }
  };


if (loading) {
  return (
    <Row>
      <Col md={12}>
        <Card>
          <Card.Header>
            <Placeholder as="h4" animation="glow">
              <Placeholder xs={3} />
            </Placeholder>
          </Card.Header>
          <Card.Body>
            {/* File Inputs Placeholder */}
            <Row className="mb-3">
              {[...Array(4)].map((_, idx) => (
                <Col key={`file-${idx}`} lg="3">
                  <Placeholder as="p" animation="glow">
                    <Placeholder xs={4} /> {/* Label */}
                  </Placeholder>
                  {/* <Placeholder.Button variant="info" xs={12} /> File Input */}
                  <Placeholder as="div" animation="glow" className="mt-2">
                    <Placeholder style={{ width: '100px', height: '100px' }} />
                  </Placeholder>
                </Col>
              ))}
            </Row>

            {/* Text Inputs Placeholder */}
            <Row className="mb-3">
              {[...Array(3)].map((_, idx) => (
                <Col key={`text-${idx}`} lg="3">
                  <Placeholder as="p" animation="glow">
                    <Placeholder xs={6} /> {/* Label */}
                  </Placeholder>
                  <Placeholder as="input" xs={12} /> {/* Input Field */}
                </Col>
              ))}
            </Row>

            {/* Switches Placeholder */}
            <Row className="mb-3">
              {[...Array(4)].map((_, idx) => (
                <Col key={`switch-${idx}`} lg="3" className="d-flex align-items-center">
                  <Placeholder as="div" animation="glow" className="d-flex align-items-center gap-2">
                    <Placeholder xs={8} /> {/* Label */}
                    <Placeholder as="input" type="checkbox" /> {/* Switch */}
                  </Placeholder>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

  return (
    <>
      <Row className="mb-3">
        {inputConfig.fileInputs.map(({ label, key, accept }) => (
          <Col key={key} lg="3">
            <Form.Group className="mb-3">
              <Form.Label>{label}</Form.Label>
              <Form.Control
                type="file"
                disabled={loading}
                accept={accept || "image/*"}
                onChange={(e) => handleFileChange(e.target.files[0], key)}
              />
              {previews[key] && (
                <div className="mt-2">
                  <Image
                    src={previews[key].uri}
                    alt={`${label} preview`}
                    thumbnail
                    width={100}
                    height={100}
                    style={{ objectFit: "cover" }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
            </Form.Group>
          </Col>
        ))}
      </Row>

      <Row className="mb-3">
        {inputConfig.textInputs.map(({ label, key, type, placeholder }) => (
          <Col key={key} lg="3">
            <Form.Group className="mb-3">
              <Form.Label>{label}</Form.Label>
              <Form.Control
                type={type}
                disabled={loading}
                placeholder={placeholder}
                value={settings[key] || ""}
                onChange={(e) => onSettingChange(key, e.target.value)}
              />
            </Form.Group>
          </Col>
        ))}
      </Row>

      <Row className="mb-3">
        {inputConfig.switches.map(({ label, key, col }) => (
          <Col key={key} lg={col} className="d-flex align-items-center">
            <Form.Group className="mb-0">
              <Form.Label>{label}</Form.Label>
              <Form.Check
                type="switch"
                disabled={loading}
                checked={!!settings[key]}
                onChange={(e) => onSettingChange(key, e.target.checked)}
              />
            </Form.Group>
          </Col>
        ))}
      </Row>

      {loading && (
        <div className="text-center mb-3">
          <Spinner animation="border" size="sm" /> Saving...
        </div>
      )}
    </>
  );
};

export default SiteSettings;

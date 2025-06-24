import React from "react";
import { Card, Form, Row, Col, Button, Placeholder } from "react-bootstrap";

const UserFormSkeleton = () => {
  return (
    <div className="row g-3">
      <Row>
        {/* Left Card (Admin only) */}
        <Col xl="3" lg="4">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <div className="header-title">
                <Placeholder as={Card.Title} animation="glow">
                  <Placeholder xs={6} />
                </Placeholder>
              </div>
            </Card.Header>
            <Card.Body>
              <Form.Group className="form-group">
                <div className="profile-img-edit position-relative">
                  <Placeholder animation="glow">
                    <Placeholder style={{ width: "100px", height: "100px" }} />
                  </Placeholder>
                </div>
                <div className="img-extension mt-3">
                  <Placeholder animation="glow">
                    <Placeholder xs={12} />
                  </Placeholder>
                </div>
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label>
                  <Placeholder animation="glow">
                    <Placeholder xs={4} />
                  </Placeholder>
                </Form.Label>
                <Placeholder as={Form.Select} animation="glow">
                  <Placeholder xs={12} />
                </Placeholder>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Card */}
        <Col xl="9" lg="8">
          <Form>
            {/* User Details Section */}
            <Card>
              <Card.Header className="d-flex justify-content-between">
                <div className="header-title d-flex justify-content-between align-items-center w-100">
                  <h4 className="card-title">
                    <Placeholder animation="glow">
                      <Placeholder xs={8} />
                    </Placeholder>
                  </h4>
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <Placeholder as={Button} animation="glow" xs={4} />
                    <Placeholder as={Button} animation="glow" xs={4} />
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="new-user-info">
                  <h5 className="mb-3">
                    <Placeholder animation="glow">
                      <Placeholder xs={4} />
                    </Placeholder>
                  </h5>
                  <Row>
                    {[...Array(4)].map((_, i) => (
                      <Form.Group className="col-md-3 form-group" key={i}>
                        <Form.Label>
                          <Placeholder animation="glow">
                            <Placeholder xs={4} />
                          </Placeholder>
                        </Form.Label>
                        <Placeholder as={Form.Control} animation="glow" />
                      </Form.Group>
                    ))}
                  </Row>

                  {/* Documents Section */}
                  <h5 className="mb-3 mt-4">
                    <Placeholder animation="glow">
                      <Placeholder xs={6} />
                    </Placeholder>
                  </h5>
                  <Row>
                    {[...Array(2)].map((_, i) => (
                      <Form.Group className="col-md-6 form-group" key={i}>
                        <Form.Label>
                          <Placeholder animation="glow">
                            <Placeholder xs={6} />
                          </Placeholder>
                        </Form.Label>
                        <Placeholder as={Form.Control} animation="glow" />
                      </Form.Group>
                    ))}
                  </Row>

                  {/* Address Section */}
                  <h5 className="mb-3 mt-4">
                    <Placeholder animation="glow">
                      <Placeholder xs={6} />
                    </Placeholder>
                  </h5>
                  <Row>
                    {[...Array(4)].map((_, i) => (
                      <Form.Group className="col-md-3 form-group" key={i}>
                        <Form.Label>
                          <Placeholder animation="glow">
                            <Placeholder xs={4} />
                          </Placeholder>
                        </Form.Label>
                        <Placeholder as={Form.Control} animation="glow" />
                      </Form.Group>
                    ))}
                  </Row>
                </div>
              </Card.Body>
            </Card>

            {/* Security Section */}
            <Card className="mt-4">
              <Card.Body>
                <div className="new-user-info">
                  <h5 className="mb-3">
                    <Placeholder animation="glow">
                      <Placeholder xs={4} />
                    </Placeholder>
                  </h5>
                  <Row>
                    {[...Array(3)].map((_, i) => (
                      <Form.Group className="col-md-4 form-group" key={i}>
                        <Form.Label>
                          <Placeholder animation="glow">
                            <Placeholder xs={4} />
                          </Placeholder>
                        </Form.Label>
                        <Placeholder as={Form.Control} animation="glow" />
                      </Form.Group>
                    ))}
                  </Row>

                  <div className="checkbox mb-3">
                    <Placeholder as="label" animation="glow">
                      <Placeholder xs={12} />
                    </Placeholder>
                  </div>
                  
                  <Placeholder as={Button} animation="glow" className="float-end" />
                </div>
              </Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default UserFormSkeleton;
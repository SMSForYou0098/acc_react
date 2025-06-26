import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Container,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import { User, Mail, Check, X } from "lucide-react";
import { useMyContext } from "../../../../Context/MyContextProvider";

const BulkUser = ({ show, setShow }) => {
  const { UserList } = useMyContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const onHide = () => {
    setSearchTerm("");
    setSelectedUsers([]);
    setSelectAll(false);
    setShow(false);
  };

  const filteredUsers = UserList.filter(
    (user) =>
      user.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Individual toggle
  const handleUserToggle = (userId) => {
    console.log("Toggle User ID:", userId);
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Select/Deselect all filtered users
  const handleSelectAll = () => {
    const filteredIds = filteredUsers.map((user) => user.id);
    if (selectAll) {
      setSelectedUsers((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedUsers((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  // Keep selectAll in sync
  useEffect(() => {
    const allSelected =
      filteredUsers.length > 0 &&
      filteredUsers.every((user) => selectedUsers.includes(user.id));
    setSelectAll(allSelected);
  }, [filteredUsers, selectedUsers]);

  const onSave = () => {
    // Your save logic here (e.g., pass selectedUsers to backend)
    console.log("Selected Users:", selectedUsers);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Assign Users</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Container fluid>
          <Row className="mb-3 align-items-center">
            <Col xs={12} md={10}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search users"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search Users"
                />
                <InputGroup.Text>
                  <i className="fa fa-search"></i>
                </InputGroup.Text>
              </InputGroup>
            </Col>
            <Col xs={12} md="auto" className="text-end">
              <Form.Check
                type="checkbox"
                label="Select All"
                checked={selectAll}
                onChange={handleSelectAll}
                style={{ transform: "scale(1.2)" }}
              />
            </Col>
          </Row>

          {filteredUsers.length > 0 ? (
            <ListGroup style={{ maxHeight: "600px", overflowY: "auto" }} className="border-0">
              {filteredUsers.map((user) => (
                <ListGroup.Item
                  key={user.id}
                  className="d-flex align-items-center p-3 border-0 border-bottom text-dark"
                >
                  <Form.Check
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserToggle(user.id)}
                    className="me-3"
                    style={{ transform: "scale(1.3)" }}
                  />
                  <div className="flex-grow-1 fs-5">
                    <div className="fw-bold d-flex align-items-center mb-1">
                      <User size={16} className="text-primary me-2" />
                      {user.label}
                    </div>
                    <div className="d-flex align-items-center">
                      <Mail size={14} className="text-muted me-2" />
                      <small className="text-muted">{user.email}</small>
                    </div>
                  </div>
                  <div className="ms-auto">
                    {user.approve_status === 1 ? (
                      <Check size={20} className="text-success" />
                    ) : (
                      <X size={20} className="text-danger" />
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div className="text-center py-4">
              No users found matching your search criteria
            </div>
          )}
        </Container>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave} disabled={selectedUsers.length === 0}>
          Update Group
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BulkUser;

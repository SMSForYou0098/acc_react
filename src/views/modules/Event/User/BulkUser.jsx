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
  Badge,
  Spinner,
  Placeholder,
} from "react-bootstrap";
import {
  User,
  Mail,
  Check,
  X,
  Search,
  Phone,
  Users,
  RefreshCw,
  PlusCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useMyContext } from "../../../../Context/MyContextProvider";
import axios from "axios";

const BulkUser = ({ show, setShow, id }) => {
  const { api, authToken } = useMyContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onHide = () => {
    setSearchTerm("");
    setSelectedUsers([]);
    setSelectAll(false);
    setShow(false);
    setError(null);
  };

  const onApprove = () => {
    console.log("Approved User IDs:", selectedUsers);
    onHide();
  };

  const onReject = () => {
    console.log("Rejected User IDs:", selectedUsers);
    onHide();
  };

  const getCompanyUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${api}company-users/${id}`, {
        headers: {
          Authorization: "Bearer " + authToken,
        },
      });
      if (response.data.status) {
        setUsers(response.data.data);
      } else {
        setError("Failed to load users");
      }
    } catch (error) {
      console.error("Error fetching company users:", error);
      setError("Error loading users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show && id) {
      getCompanyUsers();
    }
  }, [id, show]);

  const filteredUsers = users.filter(
    (user) =>
      user.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserToggle = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    const filteredIds = filteredUsers.map((user) => user.id);
    if (selectAll) {
      setSelectedUsers((prev) =>
        prev.filter((id) => !filteredIds.includes(id))
      );
    } else {
      setSelectedUsers((prev) =>
        Array.from(new Set([...prev, ...filteredIds]))
      );
    }
  };

  useEffect(() => {
    const allSelected =
      filteredUsers.length > 0 &&
      filteredUsers.every((user) => selectedUsers.includes(user.id));
    setSelectAll(allSelected);
  }, [filteredUsers, selectedUsers]);

  return (
    <Modal
      style={{ minHeight: "60rem" }}
      show={show}
      onHide={onHide}
      size="lg"
      centered
      scrollable
    >
      <Modal.Header style={{marginBottom:'1rem'}} closeButton>
        <Modal.Title>Manage Users</Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-0">
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

          {/* Content: Loading / Error / Empty / List */}
          {loading ? (
            <div>
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="d-flex align-items-center p-3 mb-3 bg-white rounded-3 shadow-sm"
                >
                  <Placeholder animation="glow" className="me-3">
                    <Placeholder
                      className="rounded-circle"
                      style={{ width: 44, height: 44 }}
                    />
                  </Placeholder>
                  <div className="flex-grow-1">
                    <Placeholder as="div" animation="glow" className="mb-2">
                      <Placeholder xs={6} />
                    </Placeholder>
                    <Placeholder as="div" animation="glow" className="mb-1">
                      <Placeholder xs={8} />
                    </Placeholder>
                    <Placeholder as="div" animation="glow">
                      <Placeholder xs={5} />
                    </Placeholder>
                  </div>
                  <Placeholder
                    as={Badge}
                    animation="glow"
                    bg="secondary"
                    style={{ width: 80, height: 24 }}
                  />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <div className="bg-light rounded-4 p-4 p-md-5 border">
                <X size={48} className="text-danger mb-3" />
                <h5 className="text-danger mb-3">{error}</h5>
                <Button
                  variant="primary"
                  size="md"
                  onClick={getCompanyUsers}
                  className="px-4 rounded-pill"
                >
                  <RefreshCw className="me-2" /> Retry
                </Button>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <div className="">
                <Search size={48} className="mb-3"/>
                <h5 className="mb-2 fw-medium">
                  {searchTerm
                    ? "No matching users found"
                    : "No users available"}
                </h5>
                <p className="text-muted mb-4">
                  {searchTerm
                    && "Try a different search term"}
                </p>
              </div>
            </div>
          ) : (
            <div
              className="user-list-container"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`border-bottom border-0 d-flex align-items-center p-3 bg-white rounded-3 transition-all ${
                    selectedUsers.includes(user.id)
                      ? "border-primary border-2"
                      : "border"
                  }`}
                >
                  <Form.Check
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserToggle(user.id)}
                    className="me-3 mt-1"
                    style={{ transform: "scale(1.2)" }}
                  />

                  <div className="position-relative me-3">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: 44, height: 44, fontSize: 20 }}
                    >
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    {user.approval_status === 1 ? (
                      <CheckCircle
                        className="position-absolute bottom-0 end-0 bg-white rounded-circle p-1 border text-success"
                        size={16}
                        style={{ right: -6, bottom: -6 }}
                      />
                    ) : (
                      <AlertCircle
                        className="position-absolute bottom-0 end-0 bg-white rounded-circle p-1 border text-warning"
                        size={16}
                        style={{ right: -6, bottom: -6 }}
                      />
                    )}
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-1">
                      <span className="fw-semibold me-2">
                        {user?.name || "Unknown User"}
                      </span>
                      {user.role && (
                        <Badge
                          bg="light"
                          text="dark"
                          className="border small py-1"
                        >
                          {user.role}
                        </Badge>
                      )}
                    </div>
                    <div className="d-flex align-items-center mb-1 small text-truncate">
                      <Mail className="text-muted me-2" size={14} />
                      <span className="text-muted">
                        {user?.email || "No email provided"}
                      </span>
                    </div>
                    <div className="d-flex align-items-center small text-truncate">
                      <Phone className="text-muted me-2" size={14} />
                      <span className="text-muted">
                        {user?.number || "No phone number"}
                      </span>
                    </div>
                  </div>

                  <div className="ms-auto">
                    {user.approval_status === 1 ? (
                      <Check size={20} className="text-success" />
                    ) : (
                      <X size={20} className="text-danger" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={onHide}
        >
          Cancel
        </Button>
        {/* <div className="d-flex gap-2">
          <Button
            variant="outline-danger"
            onClick={onReject}
            disabled={selectedUsers.length === 0}
            className="d-flex align-items-center px-4 rounded-pill"
          >
            <X className="me-1" /> Reject ({selectedUsers.length})
          </Button>
          <Button
            variant="primary"
            onClick={onApprove}
            disabled={selectedUsers.length === 0}
            className="d-flex align-items-center px-4 rounded-pill"
          >
            <Check className="me-1" /> Approve ({selectedUsers.length})
          </Button>
        </div> */}
      </Modal.Footer>
    </Modal>
  );
};

export default BulkUser;

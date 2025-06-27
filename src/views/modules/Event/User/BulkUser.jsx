import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Badge,
  Placeholder,
} from "react-bootstrap";
import {
  Mail,
  Check,
  X,
  Search,
  Phone,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMyContext } from "../../../../Context/MyContextProvider";
import axios from "axios";
import { capitalize } from "lodash";

const SkeletonLoader = () => (
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
);

const BulkUser = ({ show, setShow, id, type }) => {
  const { api, authToken } = useMyContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [approving, setApproving] = useState(false);

  const onHide = () => {
    setSearchTerm("");
    setSelectedUsers([]);
    setSelectAll(false);
    setShow(false);
    setError(null);
  };

  const onApprove = async () => {
    try {
      setApproving(true);
      const response = await axios.post(
        `${api}bulk-approval`,
        {
          ids: selectedUsers,
          status : 1, // Assuming 1 is for approval
        },
        {
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        console.log("Users approved successfully:", selectedUsers);
        // Refresh the user list to show updated status
        await getCompanyUsers();
        // Clear selections
        setSelectedUsers([]);
        setSelectAll(false);
        // Close modal only on success
        onHide();
      } else {
        setError(response.data.message || "Failed to approve users");
      }
    } catch (error) {
      console.error("Error approving users:", error);
      setError("Error approving users. Please try again.");
    } finally {
      setApproving(false);
    }
  };

  const onReject = () => {
    console.log("Rejected User IDs:", selectedUsers);
    onHide();
  };

  const getCompanyUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${api}company-users/${id}/${type}`, {
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "" || // Show all users when no status filter is selected
      (statusFilter === "approve" && parseInt(user.approval_status) === 1) ||
      (statusFilter === "reject" && parseInt(user.approval_status) === 2) ||
      (statusFilter === "pending" && parseInt(user.approval_status) === 0);

    return matchesSearch && matchesStatus;
  });

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

  const HandleStatus = (status) => {
    setStatusFilter(status);
  };
  return (
    <Modal
      style={{ minHeight: "60rem" }}
      show={show}
      onHide={onHide}
      size="lg"
      scrollable
    >
      <Modal.Header style={{ marginBottom: "1rem" }} closeButton>
        <Modal.Title>Manage Users - {capitalize(type)}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-0">
        <Row className="mb-3 align-items-center gy-2">
          <Col xs={12} md={4}>
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
          {/* add select dropdown for status approve or reject */}
          <Col xs={12} md={4} className="d-flex justify-content-center">
            <Form.Select
              // value=""
              onChange={(e) => HandleStatus(e.target.value)}
              aria-label="Select Status"
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
            </Form.Select>
          </Col>
          {statusFilter === "pending" && (
            <Col xs={12} md="auto" className="text-end">
              <Form.Check
                type="checkbox"
                label="Select All"
                checked={selectAll}
                onChange={handleSelectAll}
                style={{ transform: "scale(1.2)" }}
              />
            </Col>
          )}
        </Row>

        {/* Content: Loading / Error / Empty / List */}
        {loading ? (
          <SkeletonLoader />
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
              <Search size={48} className="mb-3" />
              <h5 className="mb-2 fw-medium">
                {searchTerm ? "No matching users found" : "No users available"}
              </h5>
              <p className="text-muted mb-4">
                {searchTerm && "Try a different search term"}
              </p>
            </div>
          </div>
        ) : (
          <div
            className="user-list-container"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <AnimatePresence>
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  }}
                  layout
                  className={`border-bottom border-0 d-flex align-items-center p-3 bg-white rounded-3 mb-2 ${
                    selectedUsers.includes(user.id)
                      ? "border-primary border-2"
                      : "border"
                  }`}
                  style={{
                    cursor: statusFilter ? "pointer" : "default",
                    transition: "all 0.2s ease",
                  }}
                  whileTap={statusFilter ? { scale: 0.98 } : {}}
                  onClick={
                    statusFilter ? () => handleUserToggle(user.id) : undefined
                  }
                >
                  {statusFilter === "pending" && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="me-3 mt-1"
                    >
                      <motion.div
                        animate={
                          selectedUsers.includes(user.id)
                            ? {
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0],
                              }
                            : {}
                        }
                        transition={{ duration: 0.3 }}
                      >
                        <Form.Check
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserToggle(user.id)}
                          style={{ transform: "scale(1.2)" }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </motion.div>
                    </motion.div>
                  )}

                  <motion.div
                    className="position-relative me-3"
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: 44, height: 44, fontSize: 20 }}
                      animate={
                        selectedUsers.includes(user.id)
                          ? {
                              backgroundColor: [
                                "#0d6efd",
                                "#198754",
                                "#0d6efd",
                              ],
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.5,
                        repeat: selectedUsers.includes(user.id) ? Infinity : 0,
                        repeatType: "reverse",
                      }}
                    >
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
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
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="flex-grow-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="d-flex align-items-center mb-1">
                      <motion.span
                        className="fw-semibold me-2"
                        transition={{ duration: 0.2 }}
                      >
                        {user?.name || "Unknown User"}
                      </motion.span>
                      {type === "organizer" && user.role && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.4, type: "spring" }}
                        >
                          <Badge
                            bg="light"
                            text={
                              user.role === "Company" ? "primary" : "warning"
                            }
                            className={`border small py-1 ${
                              user.role === "Company"
                                ? "border-primary"
                                : "border-warning"
                            }`}
                          >
                            {user.role}
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                    <motion.div
                      className="d-flex align-items-center mb-1 small text-truncate"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Mail className="text-muted me-2" size={14} />
                      <span className="text-muted">
                        {user?.email || "No email provided"}
                      </span>
                    </motion.div>
                    <motion.div
                      className="d-flex align-items-center small text-truncate"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Phone className="text-muted me-2" size={14} />
                      <span className="text-muted">
                        {user?.number || "No phone number"}
                      </span>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="ms-auto"
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {parseInt(user.approval_status) === 1 ? (
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <Check size={20} className="text-success" />
                      </motion.div>
                    ) : parseInt(user.approval_status) === 0 ? (
                      <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Clock size={20} className="text-warning" />
                      </motion.div>
                    ) : (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <X size={20} className="text-danger" />
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Cancel
        </Button>
        {statusFilter === "pending" && selectedUsers.length > 0 && (
          <Button
            variant="primary"
            onClick={onApprove}
            disabled={approving}
            className="d-flex align-items-center px-4"
          >
            {approving ? (
              <>
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                Approving...
              </>
            ) : (
              <>
                <Check className="me-1" /> Approve ({selectedUsers.length})
              </>
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default BulkUser;

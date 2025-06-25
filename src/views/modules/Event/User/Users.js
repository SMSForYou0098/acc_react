import { Settings, Trash2, CheckCircle, XCircle, Clock, Eye, IdCard } from "lucide-react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../../../../Context/MyContextProvider";
import { CustomTooltip } from "../CustomUtils/CustomTooltip";
import React, { memo, Fragment, useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import CommonListing from "../CustomUtils/CommonListing";
import UserDetailModal from "./UserDetailModal";
import IdCardModal from "../ID Card/IdCardModal";

const Users = memo(() => {
  const { api, formatDateTime, successAlert, authToken, ErrorAlert,UserData } = useMyContext();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [assignedZoneIds,setAssignedZoneIds] = useState([])
  const [zoneModal, setZoneModal] = useState({
    show: false,
    user: null,
    assignedZoneIds: [],
  });
  const [bgRequired, setBgRequired] = useState(false);
  const [showIdModal, setShowIdModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleShowIdCardModal = (id) => {
    setSelectedId(id);
    showMultiAlert();
    const user = users.find(u => u.id === id);
      if (user) {
        setSelectedUser(user);
        // setShowModal(true);
      }
  };

  const handleCloseIdCardModal = () => {
    setShowIdModal(false);
    setSelectedId(null);
  };

  const fetchZones = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}zone`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      });
      if (response.data.status) {
        setZones(response.data.data);
      } else {
        setZones([]);
      }
    } catch (error) {
      const err = error.response?.data?.message || error.response?.data?.error || `Failed to fetch Data`;
      ErrorAlert(err);
    } finally {
      setLoading(false);
    }
  }, [api, authToken, ErrorAlert]);

  const GetUsers = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${api}users`;
      const res = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + authToken,
        },
      });
      // organiser's company name was not displaying so 
      if (res.data.status) {
        const enhancedAllData = res.data.allData.map((user) => {
          if (user.role_name === "Organizer" && !user.company_name) {
            const matchingOrganizer = res?.data?.organizers?.find(
              (org) => org.value === user.id
            );
            if (matchingOrganizer?.company_name) {
              return {
                ...user,
                company_name: matchingOrganizer.company_name,
              };
            }
          }
          return user;
        });

        setUsers(enhancedAllData ?? []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [authToken, api]);

  useEffect(() => {
    fetchZones();
    GetUsers();
  }, [fetchZones, GetUsers]);

  const AssignCredit = useCallback((id) => {
    navigate(`manage/${id}`);
  }, [navigate]);

  const HandleDelete = useCallback(async (id) => {
    if (!id) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`${api}user-delete/${id}`, {
          headers: {
            Authorization: "Bearer " + authToken,
          },
        });
        if (res.data?.status) {
          GetUsers();
          successAlert("Success", "User Deleted successfully.");
        }
      } catch (err) {
        ErrorAlert(err.response?.data?.message || "An error occurred");
      }
    }
  }, [authToken, ErrorAlert, GetUsers, successAlert, api]);
  const handleApproval = useCallback(async (id, status) => {
    if (!id) return;
    
    const isApproval = status === "1";
    const actionText = status === "1" ? "approve" : "reject";

    const result = await Swal.fire({
    title: `Are you sure?`,
    text: `You are about to ${actionText} this user.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: `Yes, ${actionText} user!`,
    input: isApproval ? null : "textarea",
    inputPlaceholder: "Enter reason for rejection...",
    inputValidator: (value) => {
      if (!isApproval && !value.trim()) {
        return "Rejection reason is required.";
      }
    },
  });

    if (result.isConfirmed) {
      try {
        const res = await axios.post(`${api}user-approval`,
          { status: parseInt(status),
            user_id:id,
            approval_id:UserData.id,
            description: result.value || "", // result.value contains the textarea input
           },
          {
            headers: {
              Authorization: "Bearer " + authToken,
            },
          }
        );

        if (res.data?.status) {
          GetUsers();
          successAlert("Success", `User ${status === "1" ? "approved" : "rejected"} successfully.`);
        }
      } catch (err) {
        ErrorAlert(err.response?.data?.message || "An error occurred");
      }
    }
  }, [authToken, ErrorAlert, GetUsers, successAlert, api]);

  const handlePreview = useCallback(async (id) => {
    try {
      // Find user in current state first to show modal quickly
      const user = users.find(u => u.id === id);
      if (user) {
        setSelectedUser(user);
        setShowModal(true);
      } else {
        // If not found, fetch from API
        const res = await axios.get(`${api}user/${id}`, {
          headers: {
            Authorization: "Bearer " + authToken,
          },
        });
        if (res.data?.status) {
          setSelectedUser(res.data.data);
          setShowModal(true);
        }
      }
    } catch (err) {
      ErrorAlert(err.response?.data?.message || "Failed to load user details");
    }
  }, [users, api, authToken, ErrorAlert]);

    const showMultiAlert = useCallback(() => {
    Swal.fire({
        title: 'Background Selection',
        text: 'Please choose whether you want the ticket with or without a background.',
        icon: 'question',
        showCancelButton: false,
        showDenyButton: true,
        showCloseButton: true,
        confirmButtonText: 'With Background',
        denyButtonText: 'Without Background',
        allowOutsideClick: true,
    }).then((result) => {
        if (result.isConfirmed) {
            // User clicked "With Background"
            setBgRequired(true);
            setShowModal(true);
        } else if (result.isDenied) {
            // User clicked "Without Background"
            setBgRequired(false);
            setShowModal(true);
        }
    });
}, [setBgRequired, setShowModal]);



  const columns = [
    {
      dataField: "id",
      text: "#",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
      headerAlign: "center",
      align: "center",
      sort: true,
    },
    {
      dataField: "name",
      text: "Name",
      headerAlign: "center",
      align: "center",
      sort: true,
    },
    {
      dataField: "contact",
      text: "Contact",
      headerAlign: "center",
      align: "center",
      sort: true,
    },
    {
      dataField: "email",
      text: "Email",
      headerAlign: "center",
      align: "center",
      sort: true,
    },
    {
      dataField: "authentication",
      text: "Auth",
      formatter: (cell) => (parseInt(cell) === 1 ? "Password" : "OTP"),
      headerAlign: "center",
      align: "center",
      sort: true,
    },
    {
      dataField: "role_name",
      text: "Role",
      formatter: (cell) => {
        const badgeClass =
          {
            Admin: "bg-info",
            Organizer: "bg-primary",
            User: "bg-warning",
            Agent: "bg-danger",
            "Support Executive": "bg-success",
          }[cell] || "bg-secondary";
        return (
          <span className={`badge p-2 fw-normal ls-1 ${badgeClass} w-100`}>
            {cell}
          </span>
        );
      },
      headerAlign: "center",
      align: "center",
      sort: true,
    },
    // {
    //   dataField: 'organisation.name',
    //   text: 'Organisation',
    //   headerAlign: 'center',
    //   align: 'center',
    //   sort: true
    // },
    {
      dataField: "company_name",
      text: "Company Name",
      headerAlign: "center",
      align: "center",
      sort: true,
      formatter: (cell, row) => {
        return (
          cell || row.organiser_company_name || row.user_company_name || "—"
        );
      },
    },
    {
      dataField: "organiser_name",
      text: "Organiser",
      headerAlign: "center",
      align: "center",
      sort: true,
      formatter: (cell, row) => {
        return cell || row.organiser_company_name || row.user_org_name || "—";
      },
    },
    {
      dataField: "approval_status",
      text: "Status",
      formatter: (cell, row) => {
        if (row.role_name !== "User") {
          return (
            <CustomTooltip text="Approved">
              <Button
                variant="outline-success"
                className="btn-sm btn-icon"
                disabled
              >
                <CheckCircle size={16} />
              </Button>
            </CustomTooltip>
          );
        }
        let badgeClass = "";
        let statusText = "";
        let statusIcon = null;

        if (cell === 0) {
          badgeClass = "warning";
          statusText = "Pending";
          statusIcon = <Clock size={16} />;
        } else if (cell === 1) {
          badgeClass = "success";
          statusText = "Approved";
          statusIcon = <CheckCircle size={16} />;
        } else {
          badgeClass = "danger";
          statusText = "Rejected";
          statusIcon = <XCircle size={16} />;
        }

        return (
          <CustomTooltip text={statusText}>
            <Button
              variant={`outline-${badgeClass}`}
              className="btn-sm btn-icon"
              disabled
            >
              {statusIcon}
            </Button>
          </CustomTooltip>
        );
      },
      headerAlign: "center",
      align: "center",
      sort: true,
    },
    {
      dataField: "approval",
      text: "Approval Actions",
      formatter: (cell, row) => {
        // Only show approval buttons for pending users
        if (row.approval_status === 0) {
          if (row.role_name === "User" && row.approval_status === 0) {
            return (
              <div className="d-flex gap-2 justify-content-center">
                <CustomTooltip text="Approve User">
                  <Button
                    variant={`outline-success`}
                    className="btn-sm btn-icon"
                    onClick={() => handleApproval(row.id, "1")}
                  >
                    <CheckCircle size={16} />
                  </Button>
                </CustomTooltip>
                <CustomTooltip text="Reject User">
                  <Button
                    variant={`outline-danger`}
                    className="btn-sm btn-icon"
                    onClick={() => handleApproval(row.id, "2")}
                  >
                    <XCircle size={16} />
                  </Button>
                </CustomTooltip>
              </div>
            );
          }
        }
        return <span className="text-muted">No action needed</span>;
      },
      headerAlign: "center",
      align: "center",
    },
    {
      dataField: "zoneData",
      text: "Zones",
      formatter: (cell, row) => {
        // If role is not User, show a custom text
        if (row.role_name !== "User") {
          return <span className="text-muted">No action needed</span>;
        }
        setAssignedZoneIds(cell);
        const assignedZoneIds = (cell || []).map((z) => z.id);

        // Sort: assigned zones first, then unassigned
        const sortedZones = [...zones].sort((a, b) => {
          const aAssigned = assignedZoneIds.includes(a.id);
          const bAssigned = assignedZoneIds.includes(b.id);
          return aAssigned === bAssigned ? 0 : aAssigned ? -1 : 1;
        });

        // Limit to first 5 zones to display
        const displayZones = sortedZones.slice(0, 5);

        const remainingZones = zones.length > 5 ? zones.length - 5 : 0;

        return (
          <div className="d-flex gap-1 justify-content-center">
            {/* Display the first 5 zones (or fewer if less exist) */}
            {displayZones.map((zone, index) => {
              const isAssigned =
                Array.isArray(assignedZoneIds) &&
                assignedZoneIds.includes(zone.id);
              return (
                <CustomTooltip key={index} text={zone.title || zone.name}>
                  <Button
                    size="sm"
                    variant={isAssigned ? "success" : "danger"}
                    className="rounded-3 border shadow-sm px-2 py-1"
                    style={{
                      minWidth: "32px",
                      height: "26px",
                    }}
                    disabled
                  >
                    {isAssigned ? (
                      <CheckCircle size={14} className="mx-auto" />
                    ) : (
                      <XCircle size={14} className="mx-auto" opacity={0.6} />
                    )}
                  </Button>
                </CustomTooltip>
              );
            })}

            {/* If there are more zones than we can display, show a +n button */}
            {remainingZones > 0 && (
              <CustomTooltip
                text={`${remainingZones} more zone${
                  remainingZones > 1 ? "s" : ""
                }`}
              >
                <Button
                  size="sm"
                  variant="primary"
                  className="rounded-3 border shadow-sm px-2 py-1"
                  style={{
                    minWidth: "32px",
                    height: "26px",
                    fontSize: "0.7rem",
                  }}
                  onClick={() =>
                    setZoneModal({
                      show: true,
                      user: row,
                      assignedZoneIds: (cell || []).map((z) => z.id),
                    })
                  }
                >
                  +{remainingZones}
                </Button>
              </CustomTooltip>
            )}

            {/* If no zones exist at all */}
            {zones.length === 0 && (
              <span className="text-muted small">No zones available</span>
            )}
          </div>
        );
      },
      headerAlign: "center",
      align: "center",
      sort: true,
    },
    {
      dataField: "created_at",
      text: "Created At",
      formatter: (cell) => formatDateTime(cell),
      headerAlign: "center",
      align: "center",
      sort: true,
    },
    {
      dataField: "action",
      text: "Action",
      formatter: (cell, row) => {
        const actions = [
          {
            tooltip: "Generate ID Card",
            onClick: () => handleShowIdCardModal(row.id),
            icon: <IdCard size={16} />,
            variant: "secondary",
            isDisabled: row?.status !== 1 || row.approval_status !== 1,
          },
          {
            tooltip: "Preview User",
            onClick: () => handlePreview(row.id),
            icon: <Eye size={16} />,
            variant: "info",
          },
          {
            tooltip: "Manage User",
            onClick: () => AssignCredit(row.id),
            icon: <Settings size={16} />,
            variant: "primary",
          },
          {
            tooltip: "Delete User",
            onClick: () => HandleDelete(row.id),
            icon: <Trash2 size={16} />,
            variant: "danger",
          },
        ];

        return (
          <div className="d-flex gap-2 justify-content-center">
            {actions.map((action, index) => (
              <CustomTooltip key={index} text={action.tooltip}>
                <Button
                  variant={action.variant}
                  className="btn-sm btn-icon"
                  onClick={action.onClick}
                  disabled={action?.isDisabled}
                >
                  {action.icon}
                </Button>
              </CustomTooltip>
            ))}
          </div>
        );
      },
      headerAlign: "center",
      align: "center",
    },
  ];

  return (
    <Fragment>
      <UserDetailModal
        zones={zones}
        showModal={showModal}
        setShowModal={setShowModal}
        selectedUser={selectedUser}
        handleApproval={handleApproval}
        assignedZoneIds={assignedZoneIds}
      />
      <CommonListing
        tile={"Users"}
        data={users}
        loading={loading}
        columns={columns}
        searchPlaceholder="Search users..."
        bookingLink={"new"}
        ButtonLable={"New User"}
      />
      <Modal
        show={zoneModal.show}
        onHide={() =>
          setZoneModal({ show: false, user: null, assignedZoneIds: [] })
        }
        centered
        size="md"
        className="zone-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="w-100 text-center">
            <span className="fs-5 fw-semibold text-primary">
              Zone Assignment for <strong>{zoneModal.user?.name}</strong>
            </span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="py-4">
          {zones.length === 0 ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{ minHeight: 100 }}
            >
              <p className="text-muted fs-6 mb-0">
                <i className="bi bi-exclamation-circle me-2"></i>
                No zones available
              </p>
            </div>
          ) : (
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              {zones.map((zone, i) => {
                const isAssigned = zoneModal.assignedZoneIds.includes(zone.id);
                return (
                  <CustomTooltip key={i} text={zone.title}>
                    <Button
                      size="sm"
                      variant={isAssigned ? "success" : "outline-secondary"}
                      className={`zone-btn px-3 py-2 d-flex align-items-center gap-2 shadow-sm ${
                        isAssigned ? "assigned" : ""
                      }`}
                      disabled
                    >
                      {isAssigned ? (
                        <CheckCircle size={16} className="text-white" />
                      ) : (
                        <XCircle size={16} className="text-secondary" />
                      )}
                      <span className="zone-title">{zone.title}</span>
                    </Button>
                  </CustomTooltip>
                );
              })}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="justify-content-center border-0 pt-0">
          <Button
            variant="outline-primary"
            className="px-4"
            onClick={() =>
              setZoneModal({ show: false, user: null, assignedZoneIds: [] })
            }
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <IdCardModal
        show={showIdModal}
        bgRequired={bgRequired} 
        onHide={handleCloseIdCardModal}
        id={selectedId}
        idCardData={selectedUser}
      />

    </Fragment>
  );
});

Users.displayName = "Users";
export default Users;

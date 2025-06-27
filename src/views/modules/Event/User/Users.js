import React, { memo, Fragment, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../../../../Context/MyContextProvider";
import Swal from "sweetalert2";
import axios from "axios";
import CommonListing from "../CustomUtils/CommonListing";
import UserDetailModal from "./UserDetailModal";
import IdCardModal from "../ID Card/IdCardModal";
import { capitalize } from "lodash";
import ZonePreviewModal from "./ZonePreviewModal";
import { baseColumns, defaultColumnProps, getActionColumn, getConditionalColumns } from "./UserColumns";
import BulkUser from "./BulkUser";

const Users = memo(({ type }) => {
  const { api, formatDateTime, successAlert, authToken, ErrorAlert, UserData } = useMyContext();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [zoneModal, setZoneModal] = useState({
    show: false,
    user: null,
    assignedZoneIds: [],
  });
  const [showBulkUserModal, setShowBulkUserModal] = useState(false);
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
      const url = `${api}users?type=${type}`;
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
  }, [authToken, api, type]);

  useEffect(() => {
    fetchZones();
    GetUsers();
  }, [fetchZones, GetUsers]);

  const AssignCredit = useCallback((id) => {
    navigate(`/dashboard/users/manage/${id}`);
  }, [navigate]);

  const HandleBulkUser = useCallback((id) => {
    setShowBulkUserModal(true);
    setSelectedId(id)
  }, [setShowBulkUserModal]);

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
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.post(`${api}user-approval`,
          {
            status: parseInt(status),
            user_id: id,
            approval_id: UserData.id,
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
        setShowIdModal(true);
      } else if (result.isDenied) {
        // User clicked "Without Background"
        setBgRequired(false);
        setShowIdModal(true);
      }
    });
  }, [setBgRequired, setShowIdModal]);




  const columns = [
    ...baseColumns,
    ...getConditionalColumns(type, zones, setZoneModal, handleApproval),
    {
      dataField: "created_at",
      text: "Created At",
      formatter: (cell) => formatDateTime(cell),
      ...defaultColumnProps,
    },
    getActionColumn(type, {
      handleShowIdCardModal,
      handlePreview,
      AssignCredit,
      HandleDelete,
      HandleBulkUser,
    }),
  ];

  return (
    <Fragment>
      <UserDetailModal
        zones={zones}
        showModal={showModal}
        setShowModal={setShowModal}
        selectedUser={selectedUser}
        handleApproval={handleApproval}
      />
      <CommonListing
        tile={`${capitalize(type)} List`}
        data={users}
        loading={loading}
        columns={columns}
        searchPlaceholder="Search users..."
        bookingLink={"/dashboard/users/new"}
        ButtonLable={"New User"}
      />
      <BulkUser
        show={showBulkUserModal}
        setShow={setShowBulkUserModal}
        type={type}
        id={selectedId}
      />
      <ZonePreviewModal
        zoneModal={zoneModal}
        setZoneModal={setZoneModal}
        zones={zones}
      />
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

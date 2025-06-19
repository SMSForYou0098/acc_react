import { BadgeDollarSign, Phone, PlusIcon, ScanLine, Settings, ShoppingCart, Sparkle, Store, Tickets, Trash2, UsersRound } from "lucide-react";
import { Row, Col, Card, Modal, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../../../../Context/MyContextProvider";
import { CustomTooltip } from "../CustomUtils/CustomTooltip";
import React, { memo, Fragment, useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import TableWithSearch from "../CustomUtils/TableWithSearch";

const Users = memo(() => {
  const { api, formatDateTime, successAlert, userRole, authToken, ErrorAlert } = useMyContext();
  const navigate = useNavigate();
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('');
  
  const GetUsers = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = dateRange ? `?date=${dateRange}` : '';
      const url = `${api}users${queryParams}?type=all`;
      //console.log(url)
      const res = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + authToken,
        },
      });
      if (res.data.status) {
        setUsers(res.data.allData);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [authToken, api, dateRange]);

  useEffect(() => {
    GetUsers();
  }, [GetUsers, dateRange]);




  const AssignCredit = useCallback((id) => {
    navigate(`manage/${id}`);
  }, [navigate]); // Ensures function doesn't recreate on every render

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

  const [show, setShow] = useState(false);
  const HandleNaviGate = () => {
    if (userRole === 'Organizer') {
      setShow(true)
    }
    else {
      navigate('new')
    }
  }

  const HandleQueryParam = (param) => {
    if (param) {
      setShow(false)
      navigate(`/dashboard/users/new?type=${param}`);
    }
  }
  const columns = [
    {
      dataField: 'id',
      text: '#',
      formatter: (cell, row, rowIndex) => rowIndex + 1,
      headerAlign: 'center',
      align: 'center',
      sort: true
    },
    {
      dataField: 'name',
      text: 'Name',
      headerAlign: 'center',
      align: 'center',
      sort: true
    },
    {
      dataField: 'contact',
      text: 'Contact',
      headerAlign: 'center',
      align: 'center',
      sort: true
    },
    {
      dataField: 'email',
      text: 'Email',
      headerAlign: 'center',
      align: 'center',
      sort: true
    },
    {
      dataField: 'authentication',
      text: 'Auth',
      formatter: (cell) => parseInt(cell) === 1 ? "Password" : "OTP",
      headerAlign: 'center',
      align: 'center',
      sort: true
    },
    {
      dataField: 'role_name',
      text: 'Role',
      formatter: (cell) => {
        const badgeClass = {
          'Admin': 'bg-info',
          'Organizer': 'bg-primary',
          'User': 'bg-warning',
          'Agent': 'bg-danger',
          'Support Executive': 'bg-success'
        }[cell] || 'bg-secondary';
        return <span className={`badge p-2 fw-normal ls-1 ${badgeClass} w-100`}>{cell}</span>;
      },
      headerAlign: 'center',
      align: 'center',
      sort: true
    },
    {
      dataField: 'organisation',
      text: 'Organisation',
      headerAlign: 'center',
      align: 'center',
      sort: true
    },
    {
      dataField: 'reporting_user',
      text: 'Account Manager',
      headerAlign: 'center',
      align: 'center',
      sort: true
    },
    {
      dataField: 'status',
      text: 'Status',
      formatter: (cell) => {
        const circleClass = cell === "0" ? 'bg-danger' : 'bg-success';
        const statusText = cell === "0" ? 'Deactive' : 'Active';
        return <span className={`d-inline-block rounded-circle ${circleClass}`} style={{ width: '12px', height: '12px' }} title={statusText} />;
      },
      headerAlign: 'center',
      align: 'center',
      sort: true
    },
    {
      dataField: 'created_at',
      text: 'Created At',
      formatter: (cell) => formatDateTime(cell),
      headerAlign: 'center',
      align: 'center',
      sort: true
    },
    {
      dataField: "action",
      text: "Action",
      formatter: (cell, row) => {
        const isDisabled = row?.is_deleted || row?.status === "1";
        const actions = [
          {
            tooltip: "Manage User",
            onClick: () => AssignCredit(row.id),
            icon: <Settings size={16} />,
            variant: "primary"
          },
          {
            tooltip: "Delete User",
            onClick: () => HandleDelete(row.id),
            icon: <Trash2 size={16} />,
            variant: "danger"
          }
        ];

        return (
          <div className="d-flex gap-2 justify-content-center">
            {actions.map((action, index) => (
              <CustomTooltip key={index} text={action.tooltip}>
                <Button
                  variant={action.variant}
                  className="btn-sm btn-icon"
                  onClick={action.onClick}
                  disabled={isDisabled}
                >
                  {action.icon}
                </Button>
              </CustomTooltip>
            ))}
          </div>
        );
      },
      headerAlign: "center",
      align: "center"
    }

  ];
  const roles = [
    { label: 'POS', icon: <ShoppingCart size={16}/>, key: 'POS' },
    { label: 'Agent', icon: <UsersRound size={16}/>, key: 'Agent' },
    { label: 'Scanner', icon: <ScanLine size={16}/>, key: 'Scanner' },
    { label: 'Support Executive', icon: <Phone size={16}/>, key: 'Support-Executive' },
    { label: 'Shop Keeper', icon: <Store size={16}/>, key: 'Shop-Keeper' },
    { label: 'Box Office Manager', icon: <Tickets size={16}/>, key: 'Box-Office-Manager' },
    { label: 'Sponsor', icon: <BadgeDollarSign size={16}/>, key: 'Sponsor' },
    { label: 'Accreditation', icon: <Sparkle size={16}/>, key: 'Accreditation' },

  ];
  return (
    <Fragment>
      {/* print model  */}
      <Modal show={show} onHide={() => setShow(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Select User Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {roles?.map(({ label, icon, key }) => (
              <Col lg="3" className="mb-2" key={key}>
                <Button
                  variant="outline-primary"
                  className="w-100 text-start p-3 d-flex gap-3 align-items-center hover-effect rounded-3"
                  onClick={() => HandleQueryParam(key)}
                  style={{
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.color = 'var(--bs-primary)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.15)';
                    e.currentTarget.style.backgroundColor = 'var(--bs-primary-tint-20)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.backgroundColor = '';
                  }}
                >
                  <div className="btn btn-sm btn-icon bg-primary-subtle text-primary rounded-circle p-2">
                    <i className="icon">{icon}</i>
                  </div>
                  <span className="fw-medium">{label}</span>
                </Button>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
      {/* print model end */}

      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <div className="header-title">
                <h4 className="card-title">Users</h4>
              </div>
              <div className="button">
                <h4 className="card-title">
                  <Link onClick={() => HandleNaviGate()}>
                    <Button className="gap-1 hvr-icon-sink-away hvr-curl-top-right border-0 d-flex align-content-center justify-content-center">
                      New User
                      <PlusIcon size={22} />
                    </Button>
                  </Link>
                </h4>
              </div>
            </Card.Header>
            <Card.Body className="px-0">
              <TableWithSearch
                setDateRange={setDateRange}
                title="Users"
                data={users}
                columns={columns}
                loading={loading}
                keyField="id"
                searchPlaceholder="Search users..."
                pageOptions={[10, 25, 50, 100]}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
});

Users.displayName = "Users";
export default Users;

import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Form, Row, Col, Card, Accordion } from 'react-bootstrap';
import { useMyContext } from '../../../../Context/MyContextProvider';
import { EditIcon } from '../CustomHooks/CustomIcon';
const RolePermission = () => {
  const { api, successAlert, ErrorAlert,authToken } = useMyContext()
  const [permission, setPermission] = useState([]);
  const [initialPermission, setInitialPermission] = useState([]);
  const [existPermission, setExistPermission] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [selectAll, setSelectAll] = useState(false);
  const [unChek, setUnChek] = useState(false);
  const [roleName, setRoleName] = useState('');
  const navigate = useNavigate();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePermissionChange = (e) => {
    const permissionId = e.target.value;
    const isChecked = e.target.checked;
    if (isChecked) {
      setExistPermission((prevExistpermission) => [
        ...(prevExistpermission || []),
        parseInt(permissionId),
      ]);
    } else {
      const newPermissions = existPermission?.filter(
        (id) => id !== parseInt(permissionId)
      );
      setExistPermission(newPermissions);
    }
  };

  const PermissionData = async () => {
    try {
      const response = await axios.get(`${api}role-permission/${id}`, {
        headers: {
          'Authorization': 'Bearer ' + authToken,
        }
      });
      setPermission(response.data.AllPermission);
      setRoleName(response.data.roleName);
      setInitialPermission(response.data.AllPermission);
      setExistPermission(response.data.exist);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    PermissionData();
  }, []);

  useEffect(() => {
    if (existPermission?.length === permission?.length) {
      setUnChek(true);
    } else {
      setUnChek(false);
    }
  }, [existPermission]);

  useEffect(() => {
    // Check if all checkboxes are checked after the change
    setSelectAll(existPermission?.length === permission?.length);
  }, [existPermission, permission]);
  const handleMultiSelect = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectAll(true);
      const allPermissionIds = permission.map((p) => p.id);
      setExistPermission(allPermissionIds);
      setUnChek(true);
    } else {
      setSelectAll(false);
      setExistPermission([]);
      setUnChek(false);
    }
  };

  const GivePermission = (e) => {
    setConfirmLoading(true);
    e.preventDefault();
    let ResultData = [...new Set(existPermission)];
    if (ResultData.length > 0) {
      axios
        .post(
          `${api}role-permission/${id}`,
          {
            id,
            permission_id: ResultData,
          },
          {
            headers: {
              'Authorization': 'Bearer ' + authToken,
            }
          }
        )
        .then((Response) => {
          successAlert("Success", "Permission Assign Successfully");
          // setAlert(true);
          setConfirmLoading(false);
          scrollToTop();
        })
        .catch((error) => { });
    } else {
      ErrorAlert("You Have To Select At Least 1 Permission");
      setConfirmLoading(false);
    }
  };

  //model
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [name, setName] = useState('');
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      await axios.post(`${api}create-permission`, { name }, {
        headers: {
          'Authorization': 'Bearer ' + authToken,
        }
      });
      PermissionData();
      setConfirmLoading(false);
      handleCancel()
    } catch (error) {
      setConfirmLoading(false);
      handleCancel()
      console.log(error);
    }
  };
  const UpdatePermission = async () => {
    setConfirmLoading(true);
    try {
      await axios.post(`${api}permission-update`, { name, id: editId }, {
        headers: {
          'Authorization': 'Bearer ' + authToken,
        }
      });
      PermissionData();
      setConfirmLoading(false);
      handleCancel()
    } catch (error) {
      setConfirmLoading(false);
      handleCancel()
    }
  };
  const handleCancel = () => {
    setName("");
    setEditId('')
    setOpen(false);
    setIsEdit(false);
  };
  const handleSeach = (e) => {
    const value = e.target.value.toLowerCase();
    if (value) {
      const filteredPermissions = permission.filter(permission =>
        permission.name.toLowerCase().includes(value)
      );
      setPermission(filteredPermissions);
    } else {
      setPermission(initialPermission)
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      isEdit ? UpdatePermission() : handleOk();
    }
  };
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState('');

  useEffect(() => {
    const applyCheckboxStyles = () => {
      const checkboxes = document.querySelectorAll('.form-check-input');
      checkboxes.forEach(checkbox => {
        checkbox.style.height = '1.3rem';
        checkbox.style.width = '1.3rem';
      });
    };
    applyCheckboxStyles();
  }, [permission, unChek, existPermission, selectAll]);

  const HandleEdit = (id) => {
    let data = permission?.find((item) => item?.id === id)
    // console.log(data)
    setName(data?.name)
    setEditId(id)
    setIsEdit(true);
    setOpen(true);
  }
  const Category = ["User", "Event", "Setting", "Booking", "Scan", "POS", "Agent", "Role", "Permission", "Uncategorized"]
  const getCategoryFromPermission = (permissionName) => {
    if (permissionName.includes("POS")) return "POS";
    if (permissionName.includes("Profile")) return "User";
    if (permissionName.includes("Agent")) return "Agent";

    const matchedCategory = Category.find(cat => permissionName.includes(cat));
    return matchedCategory || 'Uncategorized';
  };

  // Group permissions by extracted category
  const groupedPermissions = permission?.reduce((acc, permission) => {
    const category = getCategoryFromPermission(permission.name);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {});

  // Handler for Select All checkbox
  const [selectAllState, setSelectAllState] = useState(
    Category.reduce((acc, category) => ({ ...acc, [category]: false }), {})
  );
  const handleSelectAllChange = (category) => {
    const isSelected = !selectAllState[category];
    setSelectAllState({ ...selectAllState, [category]: isSelected });

    const permissionsInCategory = groupedPermissions[category] || [];
    permissionsInCategory.forEach(permission => {
      handlePermissionChange({
        target: {
          value: permission.id,
          checked: isSelected
        }
      });
    });
  };

  // Ensure all permissions reflect the selectAllState
  const isAllChecked = (category) => {
    const permissionsInCategory = groupedPermissions[category] || [];
    return permissionsInCategory.every(permission => existPermission.includes(permission.id));
  };

  useEffect(() => {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
      button.style.backgroundColor = 'transparent';
    });
  }, []);

  return (
    <>
      <Modal show={open} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit Permission' : 'Create New Permission'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPermissionName">
              <Form.Label>{isEdit ? 'Permission Name' : 'Name'}</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isEdit ? 'Edit permission name' : 'Permission name'}
                onKeyDown={handleKeyDown}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={isEdit ? UpdatePermission : handleOk} disabled={confirmLoading}>
            {confirmLoading ? 'Loading...' : isEdit ? 'Update Permission' : 'Create Permission'}
          </Button>
        </Modal.Footer>
      </Modal>
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <div className="header-title">
                <h4 className="card-title">Role Permission - {roleName}</h4>
              </div>
              <div className="button">
                <h4 className="card-title">
                  <Link onClick={() => showModal()}>
                    <Button className="hvr-icon-sink-away hvr-curl-top-right border-0 d-flex align-content-center justify-content-center">
                      New Permission
                      <svg
                        className="size-28 hvr-icon ms-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.33 2H16.66C20.06 2 22 3.92 22 7.33V16.67C22 20.06 20.07 22 16.67 22H7.33C3.92 22 2 20.06 2 16.67V7.33C2 3.92 3.92 2 7.33 2ZM12.82 12.83H15.66C16.12 12.82 16.49 12.45 16.49 11.99C16.49 11.53 16.12 11.16 15.66 11.16H12.82V8.34C12.82 7.88 12.45 7.51 11.99 7.51C11.53 7.51 11.16 7.88 11.16 8.34V11.16H8.33C8.11 11.16 7.9 11.25 7.74 11.4C7.59 11.56 7.5 11.769 7.5 11.99C7.5 12.45 7.87 12.82 8.33 12.83H11.16V15.66C11.16 16.12 11.53 16.49 11.99 16.49C12.45 16.49 12.82 16.12 12.82 15.66V12.83Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </Button>
                  </Link>
                </h4>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-5">
                  <Form.Check
                    type="checkbox"
                    onChange={handleMultiSelect}
                    checked={unChek}
                  />
                  <span>{unChek ? "Deselect All" : "Select All"}</span>
                </div>
                <div>
                  <Form.Control
                    type="text"
                    placeholder="Search Permission"
                    onChange={(e) => handleSeach(e.target.value)}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
          <Row className="g-3">
            {Category?.map((category, catIndex) => (
              <Col key={catIndex} md={3}>
                <Card>
                  <Accordion>
                    <Accordion.Item eventKey="0"  className="bg-transparent border-0">
                      <Accordion.Header>{category}</Accordion.Header>
                      <Accordion.Body className="bg-transparent p-0 ">
                        <Card.Body>
                          <div className="overflow-scroll pe-5" style={{ maxHeight: '16.5rem' }}>
                            {groupedPermissions[category]?.map((item, index) => (
                              <div className="d-flex align-items-center justify-content-between mb-2" key={index}>
                                <Form.Label htmlFor={`checkbox-${item?.id}`} className='m-0 h6'>{item.name}</Form.Label>
                                <div className='d-flex gap-2 align-items-center'>
                                  <Form.Check
                                    type="checkbox"
                                    className='checkbox-lg'
                                    onChange={handlePermissionChange}
                                    value={item.id}
                                    checked={existPermission.includes(item.id) || selectAll}
                                    id={`checkbox-${item?.id}`}
                                  />
                                  <div style={{ cursor: 'pointer' }} onClick={() => HandleEdit(item?.id)}>
                                    <EditIcon/>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card.Body>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="d-flex justify-content-center align-items-center py-4 gap-3">
            <Button variant="secondary" onClick={() => navigate('/dashboard/roles')}>Cancel</Button>
            <Button
              variant="primary"
              className="ml-2"
              onClick={GivePermission}
              disabled={confirmLoading}
            >
              <span>{confirmLoading ? 'Submitting...' : 'Submit'}</span>
            </Button>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default RolePermission
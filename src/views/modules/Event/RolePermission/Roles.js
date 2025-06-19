import React, { memo, Fragment, useState, useEffect, useCallback, useMemo } from "react";
import { Row, Col, Card, Modal, Button, Form} from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../../../../Context/MyContextProvider";
import { AddIcon } from "../CustomHooks/CustomIcon";
import { Edit, Shield } from "lucide-react";
import { CustomTooltip } from "../CustomUtils/CustomTooltip";
import CustomDataTable from "../CustomHooks/CustomDataTable";


const Roles = memo(() => {
    const { api, formatDateTime, ErrorAlert, successAlert, authToken } = useMyContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);


    //role
    const RoleData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${api}role-list`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            });
            if (response.data.role) {
                setRoles(response.data.role.reverse());
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
            ErrorAlert('Failed to fetch roles');
        } finally {
            setLoading(false);
        }
    }, [api, authToken, ErrorAlert]);

    useEffect(() => {
        RoleData();
    }, [RoleData]);


    //model
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setIsId] = useState('');
    const showModal = () => {
        setOpen(true);
    };
    const handleOk = async () => {
        try {
            const response = await axios.post(`${api}create-role`, { name, guard_name: name }, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (response.data.status) {
                RoleData();
                handleCancel()
                successAlert('Role created successfully');
            }
        } catch (error) {
            handleCancel()
            console.log(error);
        }

    };
    const handleCancel = () => {
        setName("");
        setErrors({})
        setOpen(false);
        setIsEdit(false);
    };

    const HandleEdit = useCallback(
        (id) => {
            const data = roles?.find((item) => item?.id === id);
            setName(data?.name);
            setIsId(id);
            setIsEdit(true);
            setOpen(true);
        },
        [roles, setName, setIsId, setIsEdit, setOpen] // Dependencies to prevent unnecessary re-creations
    );

    const UpdateRole = async () => {
        try {
            const response = await axios.post(`${api}role-update`, { id: editId, name }, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (response.data.status) {
                RoleData();
                handleCancel()
                successAlert('Role updated successfully');
            }
        } catch (error) {
            handleCancel()
            console.log(error);
        }

    };


    //   the function 
    const AssignPermission = useCallback((id) => {
        navigate(`assign-permission/${id}`);
    }, [navigate]);
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            isEdit ? UpdateRole() : handleOk();
        }
    };

    const [errors, setErrors] = useState({});

    // Validate input
    const validate = () => {
        const newErrors = {};
        if (!name.trim()) {
            newErrors.name = "Role name is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    const handleSubmit = async () => {
        if (validate()) {
            if (isEdit) {
                await UpdateRole();
            } else {
                await handleOk();
            }
        }
    };


    const columns = useMemo(() => [
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
            // headerAlign: 'center',
            // align: 'center',
            sort: true
        },
        {
            dataField: 'created_at',
            text: 'Created At',
            formatter: (cell) => formatDateTime(cell),
            // headerAlign: 'center',
            // align: 'center',
            sort: true
        },
        {
            dataField: 'action',
            text: 'Action',
            formatter: (cell, row) => {
                const actions = [
                    {
                        tooltip: "Edit Role",
                        onClick: () => HandleEdit(row.id),
                        variant: "primary",
                        icon: <Edit size={16} />
                    },
                    {
                        tooltip: "Assign Permission",
                        onClick: () => AssignPermission(row.id),
                        variant: "secondary",
                        icon: <Shield size={16} />
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
                                >
                                    {action.icon}
                                </Button>
                            </CustomTooltip>
                        ))}
                    </div>
                );
            },
            headerAlign: 'center',
            align: 'center'
        }
    ], [HandleEdit, AssignPermission, formatDateTime]);
    return (
        <Fragment>
            {/* print model  */}
            <Modal show={open} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Edit' : 'Create New'} Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formRoleName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Role name"
                            onKeyDown={handleKeyDown}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {isEdit ? "Update Role" : "Create Role"}
                    </Button>
                    {/* <Button variant="primary" onClick={isEdit ? UpdateRole : handleOk}>
                        {isEdit ? 'Update Role' : 'Create Role'}
                    </Button> */}
                </Modal.Footer>
            </Modal>
            {/* print model end */}
            <Row>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                                <h4 className="card-title">Role</h4>
                            </div>
                            <div className="button">
                                <h4 className="card-title">
                                    <Link onClick={() => showModal()}>
                                        <Button className="me-4 hvr-icon-sink-away hvr-curl-top-right border-0 d-flex align-content-center justify-content-center">
                                            New Role
                                            <AddIcon />
                                        </Button>
                                    </Link>
                                </h4>
                            </div>
                        </Card.Header>
                        <Card.Body className="px-0">
                            <CustomDataTable
                                data={roles}
                                columns={columns}
                                loading={loading}
                                keyField="id"
                                searchPlaceholder="Search roles..."
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
});

Roles.displayName = "Roles";
export default Roles;

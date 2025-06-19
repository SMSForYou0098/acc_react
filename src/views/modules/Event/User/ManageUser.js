import React, { useEffect, useState } from "react";
import { Row, Col, Button, Form, Tab, Nav, Card } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { useMyContext } from "../../../../Context/MyContextProvider";
import AgentCredit from "./AgentCredit";
// import BookingList from "../Events/Bookings/BookingList";
import { ArrowLeftRight, CircleChevronLeft, Shield, ShoppingBag, UserIcon, Wallet } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../../store/slices/authSlice";
import { PasswordField } from "../CustomComponents/CustomFormFields";
import TransactionHistory from "./Transaction/TransactionHistory";
import LoaderComp from "../CustomUtils/LoaderComp";
import { PRIMARY } from "../CustomUtils/Consts";
const ManageUser = () => {
    const { api, authToken, successAlert, userRole, UserData, UserList, ErrorAlert, GetUsersList, HandleBack } = useMyContext();
    const dispatch = useDispatch();
    const { id } = useParams()
    const [bookings, setBookings] = useState([])
    const [roles, setRoles] = useState([])
    const [users, setUsers] = useState([])
    //user states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [number, setNumber] = useState('');
    const [organisation, setOrganisation] = useState('');
    const [altNumber, setAltNumber] = useState('');
    const [pincode, setPincode] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankNumber, setBankNumber] = useState('');
    const [bankIfsc, setBankIfsc] = useState('');
    const [bankBranch, setBankBranch] = useState('');
    const [bankMicr, setBankMicr] = useState('');
    const [validated, setValidated] = useState(false);
    const [roleId, setRoleId] = useState('');
    const [reportingUser, setReportingUser] = useState('');
    const [userType, setUserType] = useState('');
    const [qrLength, setQRLength] = useState('');
    const [status, setStatus] = useState(false);
    const [roleName, setRoleName] = useState();
    const [disableOrg, setDisableOrg] = useState(false);
    const [disable, setDisable] = useState(false);
    const [auth, setAuth] = useState(false)
    const [shopName, setShopName] = useState('');
    const [shopNumber, setShopNumber] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    const [events, setEvents] = useState([]);
    const [errorTimeout, setErrorTimeout] = useState(null);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [agentDiscount, setAgentDiscount] = useState(false);
    const [loading, setLoading] = useState(false);
    const [gates, setGates] = useState([]);
    const [selectedGates, setSelectedGates] = useState([]);
    const [ticketGroup, setTicketGroup] = useState([]);
    const [selectedTickets, setSelectedTickets] = useState([]);
    const UserDetail = async (source) => {
        if (errorTimeout) {
            clearTimeout(errorTimeout);
        }

        if (id) {
            try {
                setLoading(true);
                const res = await axios.get(`${api}edit-user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                    cancelToken: source?.token,
                });
                if (res.data.status) {
                    const data = res.data?.user;
                    if (userRole === 'Admin') {
                        if (UserList) {
                            setReportingUser(UserList.find((item) => item?.value === data.reporting_user_id));
                        }
                    }
                    setName(data.name);
                    setEmail(data.email);
                    setPassword(data.password);
                    setNumber(data.phone_number);
                    setOrganisation(data?.organisation);
                    setAltNumber(data?.alt_number);
                    setPincode(data?.pincode);
                    setAuth(data?.authentication === 1);
                    setState(data?.state);
                    setCity(data?.city);
                    setQRLength(data.qrLength);
                    setBankName(data.bank_name);
                    setBankNumber(data.bank_number);
                    setBankIfsc(data.bank_ifsc);
                    setBankBranch(data.bank_branch);
                    setStatus(data.status === 1 ? 'Active' : 'Deative');
                    setBankMicr(data.bank_micr);

                    setRoleName(data?.role?.name)
                    setRoleId(data?.role?.id)
                    setRoles(res.data?.roles)
                    setUsers(res.data?.allUser)

                    setShopName(data?.shop?.shop_name || '');
                    setShopNumber(data?.shop?.shop_no || '');
                    setGstNumber(data?.shop?.gst_no || '');
                    setSelectedTickets(data?.tickets || []);
                    if (data.reporting_user_id) {
                        await fetchUserRole(data.reporting_user_id, source);
                    }
                    setSelectedEvents(data?.events?.map(event => ({
                        value: event.id,
                        label: event.name,
                        tickets: event?.tickets
                    })));
                    setAgentDiscount(data?.agent_disc === 1);
                }
            } catch (error) {
                if (axios.isCancel(error)) {
                    //console.log('Request canceled:', error.message);
                } else {
                    const errorMessage = error.response?.data?.message
                        || error.response?.data?.error
                        || 'An error occurred while fetching user details';

                    showDelayedError(errorMessage);

                    if (error.response?.status === 404) {
                        HandleBack();
                    }
                }
            } finally {
                setLoading(false);
            }
            return () => {
                source.cancel('Operation canceled by the user.');
            };
        }
    };

    useEffect(() => {
        if (UserList && id) {
            const source = axios.CancelToken.source();
            UserDetail(source);
            return () => {
                source.cancel('Request canceled by cleanup function.');
            };
        }
    }, [id]);
    
    const handleGateChange = (selectedOptions) => {
        setSelectedGates(selectedOptions);
    }
    const fetchEvents = async () => {
        let usedId = reportingUser?.role_name === 'Organizer' ? reportingUser?.value : reportingUser?.key;
        try {
            const response = await axios.get(`${api}org-event/${usedId}`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            const eventOptions = response.data.data.map(event => ({
                value: event.id,
                label: event.name,
                tickets: event.tickets || [] // Ensure tickets are included
            }));
            setEvents(eventOptions);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        const groupedEventTicketOptions = selectedEvents?.map(event => ({
            label: event?.label,
            options: event?.tickets?.map(ticket => ({
                value: ticket?.id,       // Ticket ID
                label: ticket?.name, // Ticket Name
                eventId: event?.value       // Optional: store eventId if needed later
            }))
        }));
        setTicketGroup(groupedEventTicketOptions);
    }, [selectedEvents]);

    const showDelayedError = (errorMessage) => {
        // Clear any existing timeout
        if (errorTimeout) {
            clearTimeout(errorTimeout);
        }

        // Set new timeout to show error after 500ms
        const timeout = setTimeout(() => {
            ErrorAlert(errorMessage);
        }, 1000);

        setErrorTimeout(timeout);
    };
    const getBookings = async () => {
        setLoading(true);
        await axios.get(`${api}user-bookings/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        }).then((res) => {
            if (res.data.status) {
                setBookings(res.data.bookings)
            }
        }).catch((err) =>
            console.log(err)
        ).finally(() => {
            setLoading(false);
        })   
    }
    const WalletData = async () => {
        //console.log('mg')
        await axios.get(`${api}chek-user/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        }).then((res) => {
            if (res.data.status) {
            }
        }).catch((err) =>
            console.log(err)
        )
    }
    const fetchUserRole = async (reportingId, source) => {
        if (!reportingId) return;

        try {
            const res = await axios.get(`${api}edit-user/${reportingId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                cancelToken: source?.token,
            });

            if (res.data.status) {
                const data = res.data?.user;
                const eventOptions = data.events.map(event => ({
                    value: event.id,
                    label: event.name
                }));
                setSelectedEvents(eventOptions);
                if (data?.role?.name === 'Organizer') {
                    if (data?.organisation) {
                        setOrganisation(data?.organisation);
                    }
                    setDisable(true);
                } else {
                    setDisable(false);
                }
            }
        } catch (error) {
            if (!axios.isCancel(error)) {
                ErrorAlert(error.response?.data?.error || error.response?.data?.message);
            }
        }
    };


    useEffect(() => {
        const source = axios.CancelToken.source();

        const initializeData = async () => {
            await GUser(); // Get UserList first
            if (userRole !== 'Admin') {
                setReportingUser({ key: UserData?.id, label: UserData?.id });
                setDisableOrg(true);
                setOrganisation(UserData?.organisation);
            }
            getBookings();
            WalletData();
        };

        initializeData();

        return () => {
            source.cancel('Operation canceled by cleanup function.');
            if (errorTimeout) {
                clearTimeout(errorTimeout);
            }
        };
    }, []);

    const handleReportingUserChange = (user) => {
        setReportingUser(user);
        if (user?.value) {
            const source = axios.CancelToken.source();
            fetchUserRole(user.value, source);
        }
    };

    const GUser = async () => {
        await GetUsersList();
    }
    // console.log(data)

    const handleSubmit = async (e) => {
        if (!email) {
            ErrorAlert('Please enter email')
            return
        }
        if (!/^\d{10}$|^\d{12}$/.test(number)) {
            ErrorAlert('Mobile number must be 10 or 12 digits only');
            return;
        }
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            setValidated(true);
            const userData = {
                name,
                email,
                number,
                password,
                organisation,
                authentication: auth,
                alt_number: altNumber,
                pincode,
                state,
                city,
                role_name: roleName,
                bank_name: bankName,
                qr_length: qrLength,
                reporting_user: reportingUser?.value,
                bank_number: bankNumber,
                role_id: roleId,
                bank_ifsc: bankIfsc,
                bank_branch: bankBranch,
                bank_micr: bankMicr,
                shop_name: shopName,
                shop_no: shopNumber,
                gst_no: gstNumber,
                status: status === 'Active' ? 1 : 0,
                agent_disc: agentDiscount ? 1 : 0,
                events: (roleName === 'Agent' || roleName === 'Sponsor' || roleName === 'Accreditation') ? selectedEvents.map(event => event.value) : [],
                tickets: selectedTickets
            };
            try {
                const response = await axios.post(`${api}update-user/${id}`, userData, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                    }
                });
                if (response.data?.status) {
                    if (userRole === 'User') {
                        dispatch(updateUser(response.data.user));
                        HandleBack();
                    }
                    successAlert('User Updated', response.data.message);
                }
            } catch (error) {
                console.error('There was an error creating the user!', error);
            }
        }
    };

    useEffect(() => {
        if (roles?.length > 0 && roleId) {
            const role = roles.find((item) => item.id === Number(roleId));
            setRoleName(role?.name)
        }
    }, [roleId, roles]);

    const tabs = [
        {
            eventKey: "first",
            id: "profile-tab",
            dataTarget: "#profile",
            ariaControls: "profile",
            ariaSelected: "false",
            Icon: UserIcon,
            label: "Profile",
            condition: true,
        },
        {
            eventKey: "second",
            id: "order-tab",
            dataTarget: "#order",
            ariaControls: "order",
            ariaSelected: "false",
            Icon: ShoppingBag,
            label: "Bookings",
            condition: true,
        },
        {
            eventKey: "third",
            id: "card-tab",
            dataTarget: "#card",
            ariaControls: "card",
            ariaSelected: "true",
            Icon: Wallet,
            label: "Wallet",
            condition: roleName === 'Agent' || roleName === 'Sponsor' || roleName === 'Accreditation',
        },
        {
            eventKey: "fourth",
            id: "card-tab",
            dataTarget: "#card",
            ariaControls: "card",
            ariaSelected: "true",
            Icon: ArrowLeftRight,
            label: "Transactions",
            condition: true,
        },
    ];

    useEffect(() => {
        if (roleName === 'Agent' || roleName === 'Sponsor' || roleName === 'Accreditation') {
            //console.log(roleName,reportingUser)
            if (reportingUser) {
                fetchEvents();
            }
        }
    }, [roleName, reportingUser]);

    const HandleUserAuthType = () => {
        setAuth(!auth);
    }
    const HandleTickets = (data) => {
        setSelectedTickets(data);
    }
    // Add this function to your component
    const customFilterOption = (option, inputValue) => {
        const searchTerm = inputValue.toLowerCase().trim();

        // If no search term, show all options
        if (!searchTerm) return true;

        // If this is a direct option (ticket)
        if (!option.data.options) {
            // Check if ticket name matches
            if (option.label.toLowerCase().includes(searchTerm)) {
                return true;
            }

            // Find parent event by looping through ticketGroup
            for (const eventGroup of ticketGroup) {
                // Check if this ticket belongs to this event group
                const isTicketInGroup = eventGroup.options.some(
                    ticket => ticket.value === option.value
                );

                // If ticket is in this group and event name matches search
                if (isTicketInGroup && eventGroup.label.toLowerCase().includes(searchTerm)) {
                    return true;
                }
            }
            return false;
        }

        // If this is a group (event)
        return option.label.toLowerCase().includes(searchTerm);
    };
    return (
        <>
            <Row>
                <Col lg="12">
                    <Card>
                        <Card.Header>
                            <h4 className="card-title">
                                <span title="Back" onClick={() => HandleBack()} className="cursor-pointer">
                                    <CircleChevronLeft />
                                </span> Manage User - {roleName}</h4>
                        </Card.Header>
                        <Card.Body>
                            <Tab.Container defaultActiveKey="first">
                                <Nav className="nav nav-tabs nav-iconly gap-5 mb-5 responsive-nav" id="myTab" role="tablist">
                                    {tabs?.map(
                                        (tab, index) =>
                                            tab?.condition && (
                                                <Nav.Link
                                                    key={index}
                                                    as="button"
                                                    eventKey={tab.eventKey}
                                                    className="d-flex flex-column align-items-center w-100"
                                                    id={tab.id}
                                                    data-bs-toggle="tab"
                                                    data-bs-target={tab.dataTarget}
                                                    type="button"
                                                    role="tab"
                                                    aria-controls={tab.ariaControls}
                                                    aria-selected={tab.ariaSelected}
                                                >
                                                    <tab.Icon />
                                                    {tab.label}
                                                </Nav.Link>
                                            )
                                    )}
                                </Nav>
                                <Tab.Content>
                                    <Tab.Pane
                                        eventKey="first"
                                        id="profile"
                                        role="tabpanel"
                                        aria-labelledby="profile-tab"
                                    >
                                        {loading ? (
                                            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                                                <LoaderComp />
                                            </div>
                                        ) : (
                                            <>
                                                <Form noValidate validated={validated} className='row g-3 needs-validation'>
                                                    <Row>
                                                        <Col xl={userRole === 'Organizer' ? '12' : '12'} lg="8">
                                                            <div className="header-title d-flex justify-content-between align-items-center w-100">
                                                                <h4 className="card-title">Update {userType ? userType : 'User'}</h4>
                                                                <div className="btn">
                                                                    <Button onClick={handleSubmit} variant="btn btn-primary">
                                                                        Save
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <div className="new-user-info">
                                                                <Row>
                                                                    <Form.Group className="col-md-3 form-group">
                                                                        <Form.Label htmlFor="fname">Name:</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            id="fname"
                                                                            placeholder="Name"
                                                                            value={name}
                                                                            required
                                                                            onChange={(e) => setName(e.target.value)}
                                                                        />
                                                                    </Form.Group>
                                                                    <Form.Group className="col-md-3 form-group">
                                                                        <Form.Label htmlFor="email">Email:</Form.Label>
                                                                        <Form.Control
                                                                            type="email"
                                                                            id="email"
                                                                            required
                                                                            placeholder="Email"
                                                                            autoComplete="new-password"
                                                                            name="new-password-field"
                                                                            value={email}
                                                                            onChange={(e) => setEmail(e.target.value)}
                                                                        />
                                                                    </Form.Group>
                                                                    <Form.Group className="col-md-3 form-group">
                                                                        <Form.Label htmlFor="mobno">Mobile Number:</Form.Label>
                                                                        <Form.Control
                                                                            type="number"
                                                                            id="mobno"
                                                                            placeholder="Mobile Number"
                                                                            value={number}
                                                                            required
                                                                            onChange={(e) => setNumber(e.target.value)}
                                                                        />
                                                                    </Form.Group>
                                                                    {userRole !== 'User' &&
                                                                        <>
                                                                            <Form.Group className="col-md-3 form-group">
                                                                                <Form.Label htmlFor="lname">Organisation:</Form.Label>
                                                                                <Form.Control
                                                                                    type="text"
                                                                                    id="lname"
                                                                                    required
                                                                                    disabled={disableOrg || disable}
                                                                                    placeholder="Organisation"
                                                                                    value={organisation}
                                                                                    onChange={(e) => setOrganisation(e.target.value)}
                                                                                />
                                                                            </Form.Group>
                                                                            {!disableOrg &&
                                                                                <Form.Group className="col-md-3 form-group">
                                                                                    <Form.Label htmlFor="gstvat">Account Manager :</Form.Label>
                                                                                    <Select
                                                                                        options={UserList}
                                                                                        value={reportingUser}
                                                                                        className="js-choice"
                                                                                        select="one"
                                                                                        onChange={handleReportingUserChange}
                                                                                    />
                                                                                </Form.Group>
                                                                            }
                                                                            {!disableOrg &&
                                                                                <>
                                                                                    <Form.Group className="col-md-3 form-group">
                                                                                        <Form.Label>User Role:</Form.Label>
                                                                                        <Form.Select
                                                                                            required
                                                                                            value={roleId}
                                                                                            onChange={(e) => setRoleId(e.target.value)}
                                                                                        >
                                                                                            <option value=''>Select</option>
                                                                                            {
                                                                                                roles?.map((item, index) => (
                                                                                                    <option value={item?.id} key={index}>{item?.name}</option>
                                                                                                ))
                                                                                            }
                                                                                        </Form.Select>
                                                                                        <Form.Control.Feedback type="invalid">Please Select Role</Form.Control.Feedback>
                                                                                    </Form.Group>
                                                                                </>
                                                                            }
                                                                            {roleName === 'Scanner' && (
                                                                                <Form.Group className="col-md-3 form-group">
                                                                                    <Form.Label>Event Gates:</Form.Label>
                                                                                    <Select
                                                                                        isMulti
                                                                                        options={gates}
                                                                                        value={selectedGates}
                                                                                        onChange={(selected) => handleGateChange(selected)}
                                                                                        className="js-choice"
                                                                                        placeholder="Select Gates"
                                                                                        menuPortalTarget={document.body}
                                                                                        styles={{
                                                                                            menuPortal: base => ({ ...base, zIndex: 9999 })
                                                                                        }}
                                                                                    />
                                                                                </Form.Group>
                                                                            )}
                                                                            {(roleName === 'Agent' || roleName === 'Sponsor' || roleName === 'Accreditation') && (
                                                                                <>
                                                                                    <Form.Group className="col-md-3 form-group">
                                                                                        <Form.Label>Assign Events:</Form.Label>
                                                                                        <Select
                                                                                            isMulti
                                                                                            options={events}
                                                                                            value={selectedEvents}
                                                                                            onChange={(selected) => setSelectedEvents(selected)}
                                                                                            className="js-choice"
                                                                                            placeholder="Select Events"
                                                                                            inputProps={{
                                                                                                autoComplete: "off",
                                                                                                autoCorrect: "off",
                                                                                                spellCheck: "off"
                                                                                            }}
                                                                                        />
                                                                                    </Form.Group>
                                                                                    <Form.Group className="col-md-3 form-group">
                                                                                        <Form.Label>Assign Tickets:</Form.Label>
                                                                                        <Select
                                                                                            isMulti
                                                                                            options={ticketGroup}
                                                                                            value={selectedTickets}
                                                                                            onChange={(selected) => HandleTickets(selected)}
                                                                                            className="js-choice"
                                                                                            placeholder="Select Tickets"
                                                                                            filterOption={customFilterOption}
                                                                                            // Add these properties to prevent autofill
                                                                                            inputProps={{
                                                                                                autoComplete: "off",
                                                                                                autoCorrect: "off",
                                                                                                spellCheck: "off"
                                                                                            }}
                                                                                            styles={{
                                                                                                groupHeading: (base) => ({
                                                                                                    ...base,
                                                                                                    backgroundColor: PRIMARY,
                                                                                                    color: 'white',
                                                                                                    fontWeight: 'bold',
                                                                                                    padding: '8px 12px',
                                                                                                    margin: '0 0 4px 0'
                                                                                                }),
                                                                                                menuList: (base) => ({
                                                                                                    ...base,
                                                                                                    padding: 0
                                                                                                })
                                                                                            }}
                                                                                        />
                                                                                    </Form.Group>
                                                                                    <Form.Group className="col-md-3 form-group">
                                                                                        <Form.Label className="custom-file-input">Agent Discount</Form.Label>
                                                                                        <Form.Check className="form-switch">
                                                                                            <Form.Check.Input
                                                                                                type="checkbox"
                                                                                                className="me-2"
                                                                                                id="flexSwitchCheckDefault"
                                                                                                checked={agentDiscount}
                                                                                                onChange={(e) => setAgentDiscount(e.target.checked)}
                                                                                            />
                                                                                        </Form.Check>
                                                                                    </Form.Group>
                                                                                </>
                                                                            )}
                                                                            {/* //password */}
                                                                            {(userRole === 'Admin' || userRole === 'Organizer') &&
                                                                                <Form.Group className="col-md-3 form-group">
                                                                                    <Form.Label htmlFor="password">Password:</Form.Label>
                                                                                    <PasswordField value={password} setPassword={setPassword} />
                                                                                </Form.Group>
                                                                            }
                                                                            {(userRole === 'Admin' || userRole === 'Organizer') &&
                                                                                <Form.Group className="col-md-3 form-group">
                                                                                    <Form.Label>User Status:</Form.Label>
                                                                                    <Form.Select
                                                                                        required
                                                                                        value={status}
                                                                                        onChange={(e) => setStatus(e.target.value)}
                                                                                    >
                                                                                        <option value='Active'>Active</option>
                                                                                        <option value='Deative'>Deactive</option>
                                                                                    </Form.Select>
                                                                                    <Form.Control.Feedback type="invalid">Please Select Role</Form.Control.Feedback>
                                                                                </Form.Group>
                                                                            }
                                                                            {(roleName === 'Scanner' && !disableOrg) &&
                                                                                <Form.Group className="col-md-2 form-group">
                                                                                    <Form.Label htmlFor="qr-length">QR-Data Length:</Form.Label>
                                                                                    <Form.Control
                                                                                        type="number"
                                                                                        id="qr-length"
                                                                                        placeholder="Scan QR-Data Length"
                                                                                        value={qrLength}
                                                                                        min={6}
                                                                                        max={20}
                                                                                        required
                                                                                        onChange={(e) => {
                                                                                            const value = e.target.value;
                                                                                            if (value >= 6 && value <= 20) {
                                                                                                setQRLength(value);
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                </Form.Group>
                                                                            }
                                                                            {(userRole === 'Admin' || userRole === 'Organizer') && roleName === 'Shop Keeper' &&
                                                                                <div className="new-user-info">
                                                                                    <h5 className="mb-3">Shop Detail {roleName}</h5>
                                                                                    <Row>
                                                                                        <Form.Group className="col-md-4 form-group">
                                                                                            <Form.Label htmlFor="shopName">Shop Name:</Form.Label>
                                                                                            <Form.Control
                                                                                                type="text"
                                                                                                id="shopName"
                                                                                                placeholder="Enter Shop Name"
                                                                                                required
                                                                                                value={shopName}
                                                                                                onChange={(e) => setShopName(e.target.value)}
                                                                                            />
                                                                                        </Form.Group>
                                                                                        <Form.Group className="col-md-4 form-group">
                                                                                            <Form.Label htmlFor="shopNumber">Shop Number:</Form.Label>
                                                                                            <Form.Control
                                                                                                type="text"
                                                                                                id="shopNumber"
                                                                                                placeholder="Enter Shop Number"
                                                                                                required
                                                                                                value={shopNumber}
                                                                                                onChange={(e) => setShopNumber(e.target.value)}
                                                                                            />
                                                                                        </Form.Group>
                                                                                        <Form.Group className="col-md-4 form-group">
                                                                                            <Form.Label htmlFor="gstNumber">GST Number:</Form.Label>
                                                                                            <Form.Control
                                                                                                type="text"
                                                                                                id="gstNumber"
                                                                                                placeholder="Enter GST Number"
                                                                                                required
                                                                                                value={gstNumber}
                                                                                                onChange={(e) => setGstNumber(e.target.value)}
                                                                                            />
                                                                                        </Form.Group>
                                                                                    </Row>
                                                                                </div>
                                                                            }
                                                                            {(roleName === 'Admin' || roleName === 'Organizer') &&
                                                                                <>
                                                                                    <hr />
                                                                                    <h5 className="mb-3">Banking</h5>
                                                                                    <Form.Group className="col-md-3 form-group">
                                                                                        <Form.Label htmlFor="add1">Bank Name:</Form.Label>
                                                                                        <Form.Control
                                                                                            type="text"
                                                                                            id="add1"

                                                                                            placeholder="Bank Name"
                                                                                            value={bankName}
                                                                                            onChange={(e) => setBankName(e.target.value)}
                                                                                        />
                                                                                    </Form.Group>
                                                                                    <Form.Group className="col-md-3 form-group">
                                                                                        <Form.Label htmlFor="add2">Bank IFSC Code:</Form.Label>
                                                                                        <Form.Control
                                                                                            type="text"
                                                                                            id="add2"

                                                                                            placeholder="Bank IFSC Code"
                                                                                            value={bankIfsc}
                                                                                            onChange={(e) => setBankIfsc(e.target.value)}
                                                                                        />
                                                                                    </Form.Group>
                                                                                    <Form.Group className="col-md-3 form-group">
                                                                                        <Form.Label htmlFor="cname">Branch Name:</Form.Label>
                                                                                        <Form.Control
                                                                                            type="text"
                                                                                            id="cname"

                                                                                            placeholder="Branch Name"
                                                                                            value={bankBranch}
                                                                                            onChange={(e) => setBankBranch(e.target.value)}
                                                                                        />
                                                                                    </Form.Group>
                                                                                    <Form.Group className="col-md-3 form-group">
                                                                                        <Form.Label htmlFor="cname">Account Number:</Form.Label>
                                                                                        <Form.Control
                                                                                            type="number"
                                                                                            id="cname"

                                                                                            placeholder="Account Number"
                                                                                            value={bankNumber}
                                                                                            onChange={(e) => setBankNumber(e.target.value)}
                                                                                        />
                                                                                    </Form.Group>
                                                                                    <hr />
                                                                                    <div className="col-md-12">
                                                                                        <div className="row">
                                                                                            <div className="col-md-6">
                                                                                                <h5 className="mb-3">Address</h5>
                                                                                                <div className="row">
                                                                                                    <Form.Group className="col-md-6 form-group">
                                                                                                        <Form.Label htmlFor="city">Town/City:</Form.Label>
                                                                                                        <Form.Control
                                                                                                            type="text"
                                                                                                            id="city"

                                                                                                            placeholder="Town/City"
                                                                                                            value={city}
                                                                                                            onChange={(e) => setCity(e.target.value)}
                                                                                                        />
                                                                                                    </Form.Group>
                                                                                                    <Form.Group className="col-md-6 form-group">
                                                                                                        <Form.Label htmlFor="pno">Pin Code:</Form.Label>
                                                                                                        <Form.Control
                                                                                                            type="number"
                                                                                                            id="pno"
                                                                                                            placeholder="Pin Code"
                                                                                                            value={pincode}
                                                                                                            onChange={(e) => setPincode(e.target.value)}
                                                                                                        />
                                                                                                    </Form.Group>
                                                                                                </div>
                                                                                            </div>
                                                                                            {userType === '' &&
                                                                                                <div className="col-md-6">
                                                                                                    <h5 className="mb-3">Other</h5>
                                                                                                    <div className="row">
                                                                                                        <Form.Group className="col-md-6 form-group">
                                                                                                            <Form.Label htmlFor="gstvat">GST / VAT Tax:</Form.Label>
                                                                                                            <Form.Control
                                                                                                                type="text"
                                                                                                                id="gstvat"
                                                                                                                placeholder="GST / VAT Tax"
                                                                                                                onChange={(e) => (e.target.value)}
                                                                                                            />
                                                                                                        </Form.Group>
                                                                                                    </div>
                                                                                                </div>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                            }
                                                                        </>
                                                                    }
                                                                </Row>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                                <Card className="border border-dashed border-2 shadow-none mb-0 rounded border-primary">
                                                    <div className="card-header">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <h4 className="mb-0">Secure Your Account</h4>
                                                            <Button className="btn btn-primary" onClick={HandleUserAuthType}>
                                                                {auth ? "Enable OTP" : "Enable Password"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <Card.Body>
                                                        <div className="d-flex align-items-center">
                                                            <div>
                                                                <Shield className="text-success" />
                                                            </div>
                                                            <p className="ms-3 mb-0">
                                                                {auth
                                                                    ? "Your account is secured using a password. Click the button to enable OTP authentication instead."
                                                                    : "Your account is secured using OTP. Click the button to enable password authentication instead."}
                                                            </p>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </>
                                        )}
                                    </Tab.Pane>
                                    <Tab.Pane
                                        eventKey="second"
                                        id="order"
                                        role="tabpanel"
                                        aria-labelledby="order-tab"
                                    >
                                        {/* <BookingList bookings={bookings} loading={loading} setLoading={setLoading} /> */}
                                        <div className="col-12 text-center">
                                            <Link to="#" className="btn btn-primary">
                                                Load More
                                            </Link>
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane
                                        eventKey="third"
                                        id="card"
                                        role="tabpanel"
                                        aria-labelledby="card-tab"
                                    >
                                        {/* <h4 className="mb-4">Your Payment Options</h4> */}
                                        <AgentCredit id={id} />
                                    </Tab.Pane>
                                    <Tab.Pane
                                        eventKey="fourth"
                                        id="card"
                                        role="tabpanel"
                                        aria-labelledby="card-tab"
                                    >
                                        <TransactionHistory id={id} />
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default ManageUser

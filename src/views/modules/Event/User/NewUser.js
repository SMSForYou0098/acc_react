import React, { memo, Fragment, useState, useEffect } from "react";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
// import avatars1 from "../../../../assets/images/avatars/01.png";
import { useMyContext } from "../../../../Context/MyContextProvider";
import axios from "axios";
import Select from "react-select";
import { Pencil, User2 } from "lucide-react";
const NewUser = memo(() => {
    const { api, successAlert, userRole, UserList, UserData, authToken, ErrorAlert, HandleBack } = useMyContext();
    const location = useLocation();


    const [users, setUsers] = useState(UserList);
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
    const [roles, setRoles] = useState([]);
    const [validated, setValidated] = useState(false);
    const [repeatPassword, setRepeatPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [reportingUser, setReportingUser] = useState('');
    const [userType, setUserType] = useState('');
    const [disableOrg, setDisableOrg] = useState(false);
    const [showAM, setShowAM] = useState(false);
    const [roleName, setRoleName] = useState();
    const [shopName, setShopName] = useState('');
    const [shopNumber, setShopNumber] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    const [gstData,setGstData] = useState({
        gstNumber:"",
        gstCertificate:"",
        companyLetter:"",
        companyName:"",
    })
    const [gstCertificate,setGstCertificate] = useState('')
    const [enablePasswordAuth, setEnablePasswordAuth] = useState(false);
    const [events, setEvents] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [gates, setGates] = useState([]);
    const [selectedGates, setSelectedGates] = useState([]);

    //role
    const RoleData = async () => {
        try {
            const response = await axios.get(`${api}role-list`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            const data = (response.data.role).reverse();
            setRoles(data);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchEvents = async () => {
        const id = userRole === 'Organizer' ? UserData?.id : reportingUser?.value;
        try {
            const response = await axios.get(`${api}org-event/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            const eventOptions = response.data.data.map(event => ({
                value: event.id,
                label: event.name
            }));
            setEvents(eventOptions);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };
    useEffect(() => {
        if (roleName === 'Agent' || roleName === 'Sponsor' || roleName === 'Accreditation') {
            if (reportingUser?.value) {
                fetchEvents();
            }
        }
    }, [roleName, reportingUser]);

    const handleEventChange = (selectedOptions) => {
        setSelectedEvents(selectedOptions);
    }
    const handleGateChange = (selectedOptions) => {
        setSelectedGates(selectedOptions);
    }
    useEffect(() => {
        if (userRole === 'Organizer') {
            setReportingUser({ value: UserData?.id, label: UserData?.id })
            setDisableOrg(true)
            setOrganisation(UserData?.organisation)
        }
        const queryParams = new URLSearchParams(location.search);
        const typeParam = queryParams.get('type');
        setUserType(typeParam?.replace(/-/g, ' '));
        RoleData();
        return () => {
            const urlParams = new URLSearchParams(location.search);
            urlParams.delete('type');
        }
    }, [])



    useEffect(() => {
        if (userType && roles && Array.isArray(roles)) {
            const role = roles.find((item) => item?.name === userType);
            if (role) {
                setRoleName(role?.name);
                setRoleId(role?.id);
            }
        }
    }, [userType, roles]);


    const handleRoleChange = async (e) => {
        const selectedRoleId = e.target.value;
        setRoleId(selectedRoleId);
        let Name = roles?.find((data) => data?.id === parseInt(selectedRoleId))?.name
        setRoleName(Name)
        const rolesToDisable = ['POS', 'Agent', 'Scanner'];
        setShowAM(rolesToDisable?.includes(Name));
        if (Name) {
            try {
                const response = await axios.get(`${api}users-by-role/${Name}`, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                    }
                });
                // setUsers(response.data?.users);
            } catch (error) {
                setUsers([]);
                console.error('There was an error fetching users by role!', error);
            }
        }
    };
    const HandleReportingUser = (user) => {
        if (showAM) {
            setOrganisation(user?.organisation)
        }
        setReportingUser(user)
    }
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!email) {
        ErrorAlert("Please enter email");
        return;
      }

      if (!/^\d{10}$|^\d{12}$/.test(number)) {
        ErrorAlert("Mobile number must be 10 or 12 digits only");
        return;
      }

      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      setValidated(true);

      try {
        const formData = new FormData();

        // ✅ Append regular fields
        formData.append("name", name);
        formData.append("email", email);
        formData.append("number", number);
        formData.append("password", password);
        formData.append("organisation", organisation);
        formData.append("alt_number", altNumber);
        formData.append("pincode", pincode);
        formData.append("state", state);
        formData.append("city", city);
        formData.append("bank_name", bankName);
        formData.append("reporting_user", reportingUser?.value || "");
        formData.append("bank_number", bankNumber);
        formData.append("role_id", roleId);
        formData.append("bank_ifsc", bankIfsc);
        formData.append("bank_branch", bankBranch);
        formData.append("bank_micr", bankMicr);
        formData.append("shop_name", shopName);
        formData.append("shop_no", shopNumber);
        formData.append("gst_no", gstData.gstNumber); // ✅ Use from gstData
        formData.append("role_name", roleName);
        formData.append("authentication", enablePasswordAuth);

        // ✅ GST-related fields
        if (gstData.gstCertificate) {
          formData.append("gstCertificate", gstData.gstCertificate);
        }

        if (gstData.companyLetter) {
          formData.append("companyLetter", gstData.companyLetter);
        }

        formData.append("companyName", gstData.companyName || "");

        // ✅ Append events/gates conditionally
        if (
          roleName === "Agent" ||
          roleName === "Sponsor" ||
          roleName === "Accreditation"
        ) {
          selectedEvents.forEach((event, idx) => {
            formData.append(`events[${idx}]`, event.value);
          });
        }

        if (roleName === "Scanner") {
          selectedGates.forEach((gate, idx) => {
            formData.append(`gates[${idx}]`, gate.value);
          });
        }

        const response = await axios.post(`${api}create-user`, formData, {
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "multipart/form-data",
          },
        });

        successAlert("User created", response.data.message);
        HandleBack();
      } catch (error) {
        ErrorAlert(
          error.response?.data?.error || error.response?.data?.message
        );
      }
    };


    return (
        <Fragment>
            <Form noValidate validated={validated} className='row g-3 needs-validation'>
                <Row>
                    {userRole === 'Admin' &&
                        <Col xl="3" lg="4" className="">
                            <Card>
                                <Card.Header className="d-flex justify-content-between">
                                    <div className="header-title">
                                        <h4 className="card-title">Add New User</h4>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <Form.Group className="form-group">
                                        <div className="profile-img-edit position-relative">
                                            <User2 />
                                            <div className="upload-icone bg-primary d-flex align-items-center justify-content-center">
                                                <Pencil size={10} color="white" />
                                                <Form.Control
                                                    className="file-upload"
                                                    type="file"
                                                    accept="image/*"
                                                />
                                            </div>
                                        </div>
                                        <div className="img-extension mt-3">
                                            <div className="d-inline-block align-items-center">
                                                <span>Only</span> <Link to="#">.jpg</Link>{" "}
                                                <Link to="#">.png</Link> <Link to="#">.jpeg</Link>{" "}
                                                <span>allowed</span>
                                            </div>
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="form-group">
                                        <Form.Label>User Role:</Form.Label>
                                        <Form.Select
                                            required
                                            value={roleId}
                                            onChange={handleRoleChange}

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
                                </Card.Body>
                            </Card>
                        </Col>
                    }
                    {roleId &&
                        <Col xl={userRole === 'Organizer' ? '12' : '9'} lg="8">
                            <Form>
                                { }
                                <Card>
                                    <Card.Header className="d-flex justify-content-between">
                                        <div className="header-title d-flex justify-content-between align-items-center w-100">
                                            <h4 className="card-title">New {userType ? userType : 'User'} Information</h4>
                                            <div className="btn">
                                                <Button onClick={handleSubmit} variant="btn btn-primary">
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
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
                                                {userRole === 'Admin' &&
                                                    <>
                                                        {roleName === 'Organizer' &&
                                                            <Form.Group className="col-md-3 form-group">
                                                                <Form.Label htmlFor="lname">Organisation:</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    id="lname"
                                                                    required
                                                                    disabled={disableOrg}
                                                                    placeholder="Organisation"
                                                                    value={organisation}
                                                                    onChange={(e) => setOrganisation(e.target.value)}
                                                                />
                                                            </Form.Group>
                                                        }
                                                        {showAM &&
                                                            <Form.Group className="col-md-3 form-group">
                                                                <Form.Label htmlFor="gstvat">Account Manager :</Form.Label>
                                                                <Select
                                                                    options={UserList}
                                                                    value={reportingUser}
                                                                    className="js-choice"
                                                                    select="one"
                                                                    onChange={HandleReportingUser}
                                                                    menuPortalTarget={document.body}
                                                                    styles={{
                                                                        menuPortal: base => ({ ...base, zIndex: 9999 })
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        }
                                                    </>
                                                }
                                                {(roleName === 'Agent' || roleName === 'Sponsor' || roleName === 'Accreditation') && (
                                                    <Form.Group className="col-md-3 form-group">
                                                        <Form.Label>Assign Events:</Form.Label>
                                                        <Select
                                                            isMulti
                                                            options={events}
                                                            value={selectedEvents}
                                                            onChange={(selected) => handleEventChange(selected)}
                                                            className="js-choice"
                                                            placeholder="Select Events"
                                                            menuPortalTarget={document.body}
                                                            styles={{
                                                                menuPortal: base => ({ ...base, zIndex: 9999 })
                                                            }}
                                                        />
                                                    </Form.Group>
                                                )}
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
                                                {((userRole === 'Admin' && roleName === 'Organizer') && !userType) &&
                                                    <>
                                                        <hr />
                                                        <h5 className="mb-3">GST Data</h5>
                                                        <Form.Group className="col-md-3 form-group">
  <Form.Label htmlFor="gstNumber">GST Number:</Form.Label>
  <Form.Control
    type="text"
    id="gstNumber"
    placeholder="Enter GST Number"
    required
    value={gstData.gstNumber}
    onChange={(e) =>
      setGstData((prev) => ({ ...prev, gstNumber: e.target.value }))
    }
  />
</Form.Group>

<Form.Group className="col mb-3 form-group">
  <Form.Label>GST Certificate</Form.Label>
  <Form.Control
    accept="image/*"
    type="file"
    onChange={(e) =>
      setGstData((prev) => ({ ...prev, gstCertificate: e.target.files[0] }))
    }
  />
</Form.Group>

<Form.Group className="col mb-3 form-group">
  <Form.Label>Company Letter</Form.Label>
  <Form.Control
    accept="image/*"
    type="file"
    onChange={(e) =>
      setGstData((prev) => ({ ...prev, companyLetter: e.target.files[0] }))
    }
  />
</Form.Group>

<Form.Group className="col-md-3 form-group">
  <Form.Label htmlFor="companyName">Company Name:</Form.Label>
  <Form.Control
    type="text"
    id="companyName"
    placeholder="Company Name"
    value={gstData.companyName}
    onChange={(e) =>
      setGstData((prev) => ({ ...prev, companyName: e.target.value }))
    }
  />
</Form.Group>

                                                        {/* <Form.Group className="col-md-3 form-group">
                                                            <Form.Label htmlFor="cname">Account Number:</Form.Label>
                                                            <Form.Control
                                                                type="number"
                                                                id="cname"

                                                                placeholder="Account Number"
                                                                value={bankNumber}
                                                                onChange={(e) => setBankNumber(e.target.value)}
                                                            />
                                                        </Form.Group> */}
                                                    </>
                                                }
                                                {/* {((userRole === 'Admin' && roleName === 'Organizer') && !userType) &&
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
                                                    </>
                                                } */}
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
                                            </Row>
                                        </div>
                                    </Card.Body>
                                </Card>
                                {userType === 'Shop Keeper' &&
                                    <Card>
                                        <Card.Body>
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
                                                            onChange={(e) => setGstNumber(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                }
                                <Card>
                                    <Card.Body>
                                        <div className="new-user-info">
                                            <h5 className="mb-3">Security</h5>
                                            <Row>
                                                <Form.Group className="col-md-4 form-group">
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
                                                <Form.Group className="col-md-4 form-group">
                                                    <Form.Label htmlFor="pass">Password:</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        id="pass"
                                                        required
                                                        placeholder="Password"
                                                        autoComplete="new-password"
                                                        name="new-password-field"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="col-md-4 form-group">
                                                    <Form.Label htmlFor="rpass">Confirm Password:</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        id="rpass"
                                                        required
                                                        placeholder="Confirm Password"
                                                        value={repeatPassword}
                                                        onChange={(e) => setRepeatPassword(e.target.value)}
                                                    />
                                                </Form.Group>

                                            </Row>
                                            <div className="checkbox">
                                                <label className="form-label">
                                                    <input
                                                        type="checkbox"
                                                        className="me-2 form-check-input"
                                                        checked={enablePasswordAuth}
                                                        onChange={(e) => setEnablePasswordAuth(e.target.checked)}
                                                        id="flexCheckChecked"
                                                    />
                                                    Enable Password Authentication
                                                </label>
                                            </div>
                                            <Button onClick={handleSubmit} variant="btn btn-primary float-end">
                                                Save
                                            </Button>
                                        </div>

                                    </Card.Body>
                                </Card>

                            </Form>
                        </Col>
                    }
                </Row>
            </Form>
        </Fragment >
    );
});

NewUser.displayName = "NewUser";
export default NewUser;

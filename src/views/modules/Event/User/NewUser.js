import React, { memo, Fragment, useState, useEffect } from "react";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
// import avatars1 from "../../../../assets/images/avatars/01.png";
import { useMyContext } from "../../../../Context/MyContextProvider";
import axios from "axios";
import Select from "react-select";
import {  ArrowLeft, Pencil, Save, User2 } from "lucide-react";
import FilePreview from "./FilePreview";
import UserFormSkeleton from "./UserFormSkeleton";
const NewUser = memo(() => {
  const {api,successAlert,userRole,UserData,authToken,ErrorAlert,HandleBack} = useMyContext();
  const location = useLocation();

  const {id}= useParams();

  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
    photoId: "",
    photo: "",
    designation:"",
  });
  
  const [addressData, setAddressData] = useState({
    state: "",
    city: "",
    pinCode: "",
    address: "",
  });
  const [selectedZones, setSelectedZones] = useState([]);
  const [zones,setZones] = useState([])
 
const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [validated, setValidated] = useState(false);
  const [repeatPassword, setRepeatPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [reportingUser, setReportingUser] = useState("");
  const [userType, setUserType] = useState("");
  const [disableOrg, setDisableOrg] = useState(false);
  const [showOrg, setShowOrg] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [gstData, setGstData] = useState({
    gstNumber: "",
    gstCertificate: "",
    companyLetter: "",
    companyName: "",
  });
  const [enablePasswordAuth, setEnablePasswordAuth] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [gates, setGates] = useState([]);
  const [selectedGates, setSelectedGates] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]); // Company list
  const [selectedCompany, setSelectedCompany] = useState(null); // Selected company
  const [isLoading,setIsLoading] = useState(false)

  const [preview, setPreview] = useState({
    photoUrl: "",
    photoIdName: "",
  });

  const getZones = async () => {
  try {
    const response = await axios.get(`${api}zone`, {
      headers: {
        Authorization: "Bearer " + authToken,
      },
    });

    if (response.data.status) {
      const formattedZones = response.data.data.map((zone) => ({
        value: zone.id,
        label: zone.title,
      }));

      setZones(formattedZones);
    }
  } catch (error) {
    console.error("Failed to fetch zones:", error);
    // Optional: show user alert
  }
};



  const handleFileChange = (key, file) => {
    if (!file) return;

    if (key === "photo") {
      const isImage = file && file.type.startsWith("image/");
      if (!isImage) {
        alert("Please upload a valid image file (jpg, png, etc.)");
        return;
      }
      setPreview((prev) => ({
        ...prev,
        photoUrl: URL.createObjectURL(file),
      }));
    }

    if (key === "photoId") {
      setPreview((prev) => ({
        ...prev,
        photoIdName: file.name,
      }));
    }

    setUserData((prev) => ({ ...prev, [key]: file }));
  };

  const getCategory = async () => {
    try {
      const response = await axios.get(`${api}category`, {
        headers: {
          Authorization: "Bearer " + authToken,
        },
      });

      // Assuming response.data.data contains the category list
      const formattedEvents = response.data.data.map((event) => ({
        value: event.id,
        label: event.title,
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Optionally show error toast or message
    }
  };

  //role
  const RoleData = async () => {
    try {
      const response = await axios.get(`${api}role-list`, {
        headers: {
          Authorization: "Bearer " + authToken,
        },
      });
      const data = response.data.role.reverse();
      setRoles(data);
    } catch (error) {
      console.error("ERROR WHILE FETCHINIG ROLES-LIST", error);
    }
  };

  const handleGateChange = (selectedOptions) => {
    setSelectedGates(selectedOptions);
  };

  const getEdituserData = async () => {
  const source = axios.CancelToken.source();
  try {
    setIsLoading(true);
    const response = await axios.get(`${api}edit-user/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      cancelToken: source?.token,
    });

    if (response.data.status) {
      const user = response.data.user;

      // Set userData
      setUserData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        number: user.number || "",
        password: "", // keep it blank in edit mode
        photoId: user.photoId || "",
        photo: user.photo || "",
        designation:user.designation || ""
      }));

      // Set gstData
      setGstData({
        gstNumber: user.org_gst_no || "",
        gstCertificate: user.org_gst_certificate || "",
        companyLetter: user.company_letter || "",
        companyName: user.org_company_name || user.company_name || "",
      });

      //set zones
      const formattedZones = user?.zones?.map((zone) => ({
          value: zone.id,
          label: zone.title, // Correct field for display
        }));
        setSelectedZones(formattedZones ?? [])

      // Set selected category
      setSelectedEvents({
        label: user.category || "",
        value: user.category_id || "",
      });

      // Set addressData
      setAddressData({
        state: user.state || "",
        city: user.city || "",
        pinCode: user.pincode || "",
        address: user.address || "",
      });

      // Set reporting and company
      setReportingUser({
        value: user?.user_org_id || "",
        label: user.user_org || "",
      });
      setSelectedCompany({
        value: user?.comp_id || "",
        label: user.user_comp || "",
      });

      // Set image preview
      setPreview({
        photoUrl: user.photo || "",
        photoIdName: user.photo_id || "",
      });

      // Set role
      setRoleId(user.role.id);
      setRoleName(user.role.name);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Optionally show user-facing error alert here
  } finally {
    setIsLoading(false)
    // Do cleanup or state reset here if needed
  }
};
  
  const getOrganisers = async(Name='User')=>{
    try {
        const response = await axios.get(`${api}users-by-role/${Name}`, {
          headers: {
            Authorization: "Bearer " + authToken,
          },
        });
        setUsers(response.data?.users);
      } catch (error) {
        setUsers([]);
        console.error("There was an error fetching users by role!", error);
      }
  }

  useEffect(()=>{
    if(id){
      getEdituserData();
      getOrganisers();
      getZones();
    }
  },[id])
  useEffect(() => {
    
    if (userRole === "Organizer") {
      setReportingUser({ value: UserData?.id, label: UserData?.name });
      setDisableOrg(true);
      setGstData((prev) => ({
        ...prev,
        companyName: UserData?.organisation,
      }));
    }
    if (roleName === "Company") {
      getCategory();
    }
    const queryParams = new URLSearchParams(location.search);
    const typeParam = queryParams.get("type");
    setUserType(typeParam?.replace(/-/g, " "));
    RoleData();
    return () => {
      const urlParams = new URLSearchParams(location.search);
      urlParams.delete("type");
    };
  }, [roleName]);



  useEffect(() => {
    if (userType && roles && Array.isArray(roles)) {
      const role = roles.find((item) => item?.name === userType);
      if (role) {

        setRoleName(role?.name);
        setRoleId(role?.id);
      }
    }
  }, [userType, roles]);

  const handleChange = (key, value) => {
    setUserData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddressChange = (key, value) => {
    setAddressData((prev) => ({ ...prev, [key]: value }));
  };

  const handleRoleChange = async (e) => {
    const selectedRoleId = e.target.value;
    setRoleId(selectedRoleId);
    let Name = roles?.find(
      (data) => data?.id === parseInt(selectedRoleId)
    )?.name;
    setRoleName(Name);
    const rolesToDisable = ["Scanner", "Company"];
    setShowOrg(rolesToDisable?.includes(Name));

    if (Name) {
      getOrganisers(Name);
    }
  };

  const handleReportingUser = async (user) => {
    setReportingUser(user);
    setSelectedCompany(null); // Clear previous company selection
    //     setGstData((prev)=>({
    //       //       ...prev,
    //       //       companyName:user?.organisation
    //       //     }))
    //       // }
    
  if (roleName === "User") {
    const idToUse = userRole === 'Organizer' ? user.id : user.value;
    await fetchCompanies(idToUse);
  }
  };

  const fetchCompanies = async (id) => {
  try {
    const response = await axios.get(`${api}fetch-company/${id}`, {
      headers: {
        Authorization: "Bearer " + authToken,
      },
    });

    const rawCompanies = response.data?.data || [];

    const formattedCompanies = rawCompanies.map((item) => ({
      value: item.id,
      label: item.company_name,
    }));

    setCompanyOptions(formattedCompanies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    setCompanyOptions([]);
  }
};


 useEffect(() => {
  if (userRole === 'Organizer' && UserData?.id) {
    fetchCompanies(UserData.id);
  }
}, [userRole, UserData?.id, authToken]);



  const handleEventChange = (selectedOptions) => {
    setSelectedEvents(selectedOptions);
  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  // Basic validation
  if (roleName !== "User" && !userData.email) {
    return ErrorAlert("Please enter email");
  }

  if (!/^\d{10}$|^\d{12}$/.test(userData.number)) {
    return ErrorAlert("Mobile number must be 10 or 12 digits only");
  }

  if (userData.password !== repeatPassword) {
    return ErrorAlert("Passwords do not match.");
  }

  const form = e.currentTarget;
  if (!form.checkValidity()) {
    e.stopPropagation();
    return;
  }

  setValidated(true);

  try {
    const formData = new FormData();

    // General fields
    formData.append("name", userData?.name || "");
    formData.append("email", userData?.email || "");
    formData.append("number", userData?.number || "");
    formData.append("password", userData?.password || "");
    if(roleName ==='User'){

      formData.append("photo", userData?.photo || "");
      formData.append("photoId", userData?.photoId || "");
      formData.append("designation", userData?.designation || "");
    }

    // Address fields
    formData.append("pincode", addressData?.pinCode || "");
    formData.append("state", addressData?.state || "");
    formData.append("city", addressData?.city || "");
    formData.append("address", addressData?.address || "");


    formData.append("reporting_user", (userRole === 'Organizer' || userRole ==='Company') ? UserData.id : reportingUser?.value);
    formData.append("role_id", roleId);
    formData.append("role_name", roleName);
    formData.append("authentication", enablePasswordAuth);

    // Role-specific fields
    if (roleName === "Company") {
      formData.append("category_id", selectedEvents?.value);
    }

    if (roleName === "User" && (userRole==='Admin' || userRole==='Organizer')) {
      if (!selectedCompany?.value) {
        return ErrorAlert("Please select Company");
      }
      formData.append("zone", JSON.stringify(selectedZones.map(z => z.value)));

      formData.append("comp_id", selectedCompany?.value);
    }

    // if ((roleName === "User" || roleName === "Company") && userRole==='Admin') {
    //   if (!reportingUser?.value) {
    //     return ErrorAlert("Please select Organizer");
    //   }
      formData.append("org_id", reportingUser?.value);
    // }

    if (roleName === "Company" || roleName === "Organizer") {
      formData.append("organisation", gstData?.companyName || "");
      formData.append("gst_no", gstData?.gstNumber || "");
    }

    if(roleName==='User' && userRole==='Company'){
      formData.append("user_org_id",UserData?.reporting_user)
    }

    if (gstData?.gstCertificate) {
      formData.append("gstCertificate", gstData.gstCertificate);
    }

    if (gstData?.companyLetter) {
      formData.append("companyLetter", gstData.companyLetter);
    }

    if (roleName === "Scanner" && Array.isArray(selectedGates)) {
      selectedGates.forEach((gate, idx) => {
        formData.append(`gates[${idx}]`, gate.value);
      });
    }
    let response;
    if(id){
      response = await axios.post(`${api}update-user/${id}`, formData, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                    }
                });
    }
    else{

      response = await axios.post(`${api}create-user`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
    }

    // API call
    successAlert( id ? "User Updated" :"User created", response.data.message);
    HandleBack();
  } catch (error) {
    const message = error.response?.data?.error || error.response?.data?.message || "Submission failed";
    ErrorAlert(message);
    console.error("ERROR SUBMITTING USER", error);
  }
};


  return (
    <Fragment>
      {isLoading ? (
        <UserFormSkeleton />
      ) : (
        <Form
          noValidate
          validated={validated}
          className="row g-3 needs-validation"
        >
          <Row>
            {(userRole === "Admin" || userRole === "Organizer" || userRole==='Company') && (
              <Col xl="3" lg="4" className="">
                <Card>
                  <Card.Header className="d-flex justify-content-between">
                    <div className="header-title">
                      <h4 className="card-title">
                        {id ? "Update User" : "Add New User"}
                      </h4>
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
                        <option value="">Select</option>
                        {roles?.map((item, index) => {
                          if (item.name === "Admin" && userRole !== "Admin")
                            return null;
                          return (
                            <option value={item.id} key={index}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Please Select Role
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
            )}

            <Col xl={"9"} lg="8">
              <Form>
                {/* User Details Section */}
                <Card>
                  <Card.Header className="d-flex justify-content-between">
                    <div className="header-title d-flex justify-content-between align-items-center w-100">
                      <h4 className="card-title">
                        {id ? "Update" : "New"} {userType ? userType : "User"}{" "}
                        Information
                      </h4>

                      <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button
                          onClick={() => navigate(-1)}
                          variant="outline-secondary"
                          className="d-flex align-items-center gap-1"
                        >
                          <ArrowLeft size={16} />
                          Back
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          variant="primary"
                          className="d-flex align-items-center gap-1"
                        >
                          <Save size={16} />
                          Save
                        </Button>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div className="new-user-info">
                      <h5 className="mb-3">User Details</h5>
                      <Row>
                        <Form.Group className="col-md-3 form-group">
                          <Form.Label htmlFor="fname">Name:</Form.Label>
                          <Form.Control
                            type="text"
                            id="fname"
                            placeholder="Name"
                            value={userData?.name}
                            required
                            onChange={(e) =>
                              handleChange("name", e.target.value)
                            }
                          />
                        </Form.Group>

                        <Form.Group className="col-md-3 form-group">
                          <Form.Label htmlFor="mobno">
                            Mobile Number:
                          </Form.Label>
                          <Form.Control
                            type="number"
                            id="mobno"
                            placeholder="Mobile Number"
                            value={userData.number}
                            required
                            onChange={(e) =>
                              handleChange("number", e.target.value)
                            }
                          />
                        </Form.Group>

                        {(userRole === "Admin" || userRole==='Organizer' || userRole==='Company') && (
                          <>
                            {(roleName === "Organizer" ||
                              roleName === "Company") && (
                              <>
                                <Form.Group className="col-md-3 form-group">
                                  <Form.Label htmlFor="companyName">
                                    Company Name:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="companyName"
                                    placeholder="Company Name"
                                    value={gstData.companyName}
                                    onChange={(e) =>
                                      setGstData((prev) => ({
                                        ...prev,
                                        companyName: e.target.value,
                                      }))
                                    }
                                  />
                                </Form.Group>
                              </>
                            )}

                            {(userRole === 'Admin' && (roleName==='User' ||roleName==='Company')) && ( 
                              <Form.Group className="col-md-3 form-group">
                                <Form.Label>Organizer:</Form.Label>
                                <Select
                                  options={users}
                                  value={reportingUser}
                                  className="js-choice"
                                  placeholder="Select Organizer"
                                  onChange={handleReportingUser}
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                />
                              </Form.Group>
                            )}
                            {((userRole === "Admin" || userRole==="Organizer") && roleName==='User') && (
                              <Form.Group className="col-md-3 form-group">
                                <Form.Label>Company:</Form.Label>
                                <Select
                                  options={companyOptions}
                                  value={selectedCompany}
                                  placeholder="Select Company"
                                  onChange={(selected) =>
                                    setSelectedCompany(selected)
                                  }
                                  isDisabled={!companyOptions.length}
                                  className="js-choice"
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                />
                              </Form.Group>
                            )}
                          </>
                        )}

                        {roleName === "Company" && (
                          <Form.Group className="col-md-4 form-group">
                            <Form.Label>Category:</Form.Label>
                            <Select
                              options={events}
                              value={selectedEvents}
                              onChange={(selected) =>
                                handleEventChange(selected)
                              }
                              className="js-choice"
                              placeholder="Select Category"
                              menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                            />
                          </Form.Group>
                        )}

                        {
                          roleName === 'User' && 
                          <Form.Group className="col-md-3 form-group">
                          <Form.Label htmlFor="designation">
                            Designation:
                          </Form.Label>
                          <Form.Control
                            type="test"
                            id="designation"
                            placeholder="Designation"
                            value={userData.designation}
                            required
                            onChange={(e) =>
                              handleChange("designation", e.target.value)
                            }
                          />
                        </Form.Group>
                        }

                        {roleName === "Scanner" && (
                          <Form.Group className="col-md-3 form-group">
                            <Form.Label>Event Gates:</Form.Label>
                            <Select
                              isMulti
                              options={gates}
                              value={selectedGates}
                              onChange={(selected) =>
                                handleGateChange(selected)
                              }
                              className="js-choice"
                              placeholder="Select Gates"
                              menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                            />
                          </Form.Group>
                        )}
                      </Row>

                      {/* Documents Section */}
                      {roleName === "User" && (
                        <>
                          <h5 className="mb-3 mt-4">Documents</h5>
                          <Row>
                            <Form.Group className="col-md-6 form-group">
                              <Form.Label htmlFor="photoId">
                                Photo ID:
                              </Form.Label>
                              <Form.Control
                                type="file"
                                id="photoId"
                                accept=".pdf,image/*"
                                onChange={(e) =>
                                  handleFileChange("photoId", e.target.files[0])
                                }
                                required
                              />
                              {preview.photoIdName && (
                                <FilePreview
                                  filePath={preview.photoIdName}
                                  className="mt-2"
                                />
                              )}
                            </Form.Group>

                            <Form.Group className="col-md-6 form-group">
                              <Form.Label htmlFor="photo">
                                Photo (Image Only):
                              </Form.Label>
                              <Form.Control
                                type="file"
                                id="photo"
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileChange("photo", e.target.files[0])
                                }
                                required
                              />
                              {preview.photoUrl && (
                                <div className="mt-2">
                                  <img
                                    src={preview.photoUrl}
                                    alt="Preview"
                                    style={{
                                      maxWidth: "100px",
                                      borderRadius: "8px",
                                      border: "1px solid #ccc",
                                    }}
                                  />
                                </div>
                              )}
                            </Form.Group>
                          </Row>
                        </>
                      )}

                      {roleName === "Company" && !userType && (
                        <>
                          <h5 className="mb-3 mt-4">Company Documents</h5>
                          <Row>
                            <Form.Group className="col mb-4 form-group">
                              <Form.Label>Company Letter</Form.Label>
                              <Form.Control
                                accept="image/*"
                                type="file"
                                onChange={(e) =>
                                  setGstData((prev) => ({
                                    ...prev,
                                    companyLetter: e.target.files[0],
                                  }))
                                }
                              />
                              {/* Show existing file name if coming from API */}
                              {gstData.companyLetter &&
                                typeof gstData.companyLetter === "string" && (
                                  <FilePreview
                                    filePath={gstData.companyLetter}
                                    className="mt-1"
                                  />
                                )}
                            </Form.Group>
                          </Row>
                        </>
                      )}

                      {roleName === "Organizer" && !userType && (
                        <>
                          <h5 className="mb-3 mt-4">Organizer Documents</h5>
                          <Row>
                            <Form.Group className="col-6 -md-3 form-group">
                              <Form.Label htmlFor="gstCertificate">
                                GST Certificate
                              </Form.Label>
                              <Form.Control
                                type="file"
                                id="gstCertificate"
                                accept="application/pdf,image/*"
                                onChange={(e) =>
                                  setGstData((prev) => ({
                                    ...prev,
                                    gstCertificate: e.target.files[0],
                                  }))
                                }
                              />
                              {/* Display file name if coming from API */}
                              {gstData.gstCertificate &&
                                typeof gstData.gstCertificate === "string" && (
                                  <FilePreview
                                    filePath={gstData.gstCertificate}
                                    className="mt-1"
                                  />
                                )}
                            </Form.Group>

                            <Form.Group className="col-6 md-3 form-group">
                              <Form.Label htmlFor="gstNumber">
                                GST Number:
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="gstNumber"
                                placeholder="Enter GST Number"
                                required
                                value={gstData.gstNumber}
                                onChange={(e) =>
                                  setGstData((prev) => ({
                                    ...prev,
                                    gstNumber: e.target.value,
                                  }))
                                }
                              />
                            </Form.Group>
                          </Row>
                        </>
                      )}

                      {/* Address Section */}
                      <h5 className="mb-3 mt-4">Address Details</h5>
                      <Row>
                        <Form.Group className="col-md-3 form-group">
                          <Form.Label htmlFor="state">State:</Form.Label>
                          <Form.Control
                            type="text"
                            id="state"
                            placeholder="State"
                            value={addressData.state}
                            required
                            onChange={(e) =>
                              handleAddressChange("state", e.target.value)
                            }
                          />
                        </Form.Group>

                        <Form.Group className="col-md-3 form-group">
                          <Form.Label htmlFor="city">City:</Form.Label>
                          <Form.Control
                            type="text"
                            id="city"
                            placeholder="City"
                            value={addressData.city}
                            required
                            onChange={(e) =>
                              handleAddressChange("city", e.target.value)
                            }
                          />
                        </Form.Group>

                        <Form.Group className="col-md-3 form-group">
                          <Form.Label htmlFor="pinCode">Pin Code:</Form.Label>
                          <Form.Control
                            type="number"
                            max={6}
                            id="pinCode"
                            placeholder="Pin Code"
                            value={addressData.pinCode}
                            required
                            onChange={(e) =>
                              handleAddressChange("pinCode", e.target.value)
                            }
                          />
                        </Form.Group>

                        <Form.Group className="col-md-3 form-group">
                          <Form.Label htmlFor="address">Address:</Form.Label>
                          <Form.Control
                            type="text"
                            id="address"
                            placeholder="Full Address"
                            value={addressData.address}
                            required
                            onChange={(e) =>
                              handleAddressChange("address", e.target.value)
                            }
                          />
                        </Form.Group>
                      </Row>
                    </div>
                  </Card.Body>
                </Card>

                {/* zone area */}
                {(roleName === "User" && id) && (
                  <Form.Group className="col-md-12 form-group">
                    <Form.Label>Assign Zones:</Form.Label>
                    <Select
                      isMulti
                      options={zones} // 🔄 updated from `events` to `zones`
                      value={selectedZones} // 🔄 updated from `selectedEvents`
                      onChange={(selected) => setSelectedZones(selected)} // 🔄 updated handler
                      className="js-choice"
                      placeholder="Select Zones"
                      inputProps={{
                        autoComplete: "off",
                        autoCorrect: "off",
                        spellCheck: "off",
                      }}
                    />
                  </Form.Group>
                )}
                {/* Security Section */}
                <Card className="mt-4">
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
                            value={userData.email}
                            onChange={(e) =>
                              handleChange("email", e.target.value)
                            }
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
                            value={userData.password}
                            onChange={(e) =>
                              handleChange("password", e.target.value)
                            }
                          />
                        </Form.Group>

                        <Form.Group className="col-md-4 form-group">
                          <Form.Label htmlFor="rpass">
                            Confirm Password:
                          </Form.Label>
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
                            onChange={(e) =>
                              setEnablePasswordAuth(e.target.checked)
                            }
                            id="flexCheckChecked"
                          />
                          Enable Password Authentication
                        </label>
                      </div>
                      <Button
                        onClick={handleSubmit}
                        variant="btn btn-primary float-end"
                      >
                        Save
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Form>
            </Col>
          </Row>
        </Form>
      )}
    </Fragment>
  );
});

NewUser.displayName = "NewUser";
export default NewUser;

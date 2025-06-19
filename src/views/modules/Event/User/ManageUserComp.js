import React, { useEffect } from 'react'
import { Form, Row } from 'react-bootstrap'
import Select from 'react-select';
import { useMyContext } from '../../../../Context/MyContextProvider';


const ManageUserComp = ({
    UserList = [],
    roles = [],
    disableOrg = false,
    disable = false,
    userType = '',
    // Destructure all state and setter props with default values
    name = '',
    setName,
    email = '',
    setEmail,
    number = '',
    setNumber,
    organisation = '',
    setOrganisation,
    reportingUser = null,
    setReportingUser,
    roleId = '',
    setRoleId,
    bankName = '',
    setBankName,
    bankIfsc = '',
    setBankIfsc,
    bankBranch = '',
    setBankBranch,
    bankNumber = '',
    setBankNumber,
    city = '',
    setCity,
    pincode = '',
    setPincode,
    status = 'Active',
    setStatus,
}) => {
    const { userRole, UserPermissions } = useMyContext();

    const SharedInputFields = () => (
        <>
            <Form.Group className="col-md-4 form-group">
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
        </>
    );

    // Render different content based on user role and type
    if (userRole === "User") {
        return (
            <Row>
                <SharedInputFields />
            </Row>
        );
    }

    return (
        <Row>
            {/* Basic User Fields */}
            <SharedInputFields />

            {/* Organisation Fields (if not disabled) */}
            <Form.Group className="col-md-4 form-group">
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

            {!disableOrg && (
                <>
                    {/* Account Manager Dropdown */}
                    <Form.Group className="col-md-4 form-group">
                        <Form.Label htmlFor="gstvat">Account Manager:</Form.Label>
                        <Select
                            inputId="gstvat"
                            options={UserList}
                            value={reportingUser}
                            className="js-choice"
                            onChange={(user) => setReportingUser(user)}
                        />
                    </Form.Group>

                    {/* User Role Dropdown */}
                    {UserPermissions?.includes('Assign Role') &&
                        <Form.Group className="col-md-4 form-group">
                            <Form.Label>User Role:</Form.Label>
                            <Form.Select
                                required
                                value={roleId}
                                onChange={(e) => setRoleId(e.target.value)}
                            >
                                <option value=''>Select</option>
                                {roles?.map((item) => (
                                    <option key={item?.id} value={item?.id}>
                                        {item?.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please Select Role
                            </Form.Control.Feedback>
                        </Form.Group>
                    }
                </>
            )}

            {/* Banking Information (if not user type) */}
            {!userType && (
                <>
                    <hr />
                    <h5 className="mb-3">Banking</h5>
                    <Form.Group className="col-md-3 form-group">
                        <Form.Label htmlFor="bankName">Bank Name:</Form.Label>
                        <Form.Control
                            type="text"
                            id="bankName"
                            placeholder="Bank Name"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="col-md-3 form-group">
                        <Form.Label htmlFor="bankIfsc">Bank IFSC Code:</Form.Label>
                        <Form.Control
                            type="text"
                            id="bankIfsc"
                            placeholder="Bank IFSC Code"
                            value={bankIfsc}
                            onChange={(e) => setBankIfsc(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="col-md-3 form-group">
                        <Form.Label htmlFor="bankBranch">Branch Name:</Form.Label>
                        <Form.Control
                            type="text"
                            id="bankBranch"
                            placeholder="Branch Name"
                            value={bankBranch}
                            onChange={(e) => setBankBranch(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="col-md-3 form-group">
                        <Form.Label htmlFor="bankNumber">Account Number:</Form.Label>
                        <Form.Control
                            type="number"
                            id="bankNumber"
                            placeholder="Account Number"
                            value={bankNumber}
                            onChange={(e) => setBankNumber(e.target.value)}
                        />
                    </Form.Group>
                </>
            )}

            <hr />
            <div className="col-md-12">
                <div className="row">
                    {/* Address Section */}
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

                    {/* Other Information */}
                    {userType === '' && (
                        <div className="col-md-6">
                            <h5 className="mb-3">Other</h5>
                            <div className="row">
                                <Form.Group className="col-md-6 form-group">
                                    <Form.Label htmlFor="gstvat">GST / VAT Tax:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="gstvat"
                                        placeholder="GST / VAT Tax"
                                        // Fixed: Added onChange handler
                                        onChange={(e) => {
                                            // Add state setter if needed
                                            // setGstVat(e.target.value)
                                        }}
                                    />
                                </Form.Group>
                                <Form.Group className="col-md-6 form-group">
                                    <Form.Label>User Status:</Form.Label>
                                    <Form.Select
                                        required
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value='Active'>Active</option>
                                        <option value='Deactive'>Deactive</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Please Select Status
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Row>
    );
};

export default ManageUserComp

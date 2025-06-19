import React, { useEffect, useState } from 'react'
import { useMyContext } from '../../../../Context/MyContextProvider';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import CountUp from "react-countup";
import Select from 'react-select';
// import QRScanner from '../Scanner/QRScanner/QRScanner';
import { Mail, Phone, User, WalletIcon } from 'lucide-react';
// import { capitilize } from '../Wallet/Transactions';
const AgentCredit = ({ id }) => {
  const { UserData, api, successAlert, authToken, UserList, customStyles, handleWhatsappAlert } = useMyContext();

  //wallet states
  const [inputVal, settInputVal] = useState(0);
  const [initialAmount, setInitialAmount] = useState(0);
  const [amount, setAmount] = useState(" ")
  const [newCredit, setNewCredit] = useState(0)
  const [deduction, setDeduction] = useState(false)
  const [userData, setUserData] = useState([])
  const [resData, setResData] = useState([])
  const [userId, setUserId] = useState([])
  const [inputValue, setInputValue] = useState('');


  const UserCredits = async (id) => {
    if (id) {
      //console.log('ac')
      try {
        const response = await axios.get(`${api}chek-user/${id}`,
          {
            headers: {
              'Authorization': 'Bearer ' + authToken,
            }
          });
        setUserData(response.data.balance)
        setInitialAmount(response.data.balance.latest_balance || 0)
        setAmount(response.data.balance.latest_balance || 0)
      } catch {
      }
    }
  }
  useEffect(() => {
    if (id) {
      const foundUser = UserList.find(user => user.value === id);
      if (foundUser) {
        setUserId(foundUser);
      } else {
        setUserId(null); // or handle the case where user is not found
      }
    }
  }, [id]);
  useEffect(() => {
    if (id || userId?.value) {
      let passedId = id || userId?.value
      UserCredits(passedId)
    }
  }, [userId,id]);

  const handleAmount = (value) => {
    setNewCredit(value);
    settInputVal(value);
    setAmount(amount + value)
    if (value && !isNaN(value)) {
      if (deduction) {
        if (value > initialAmount) {
          setAmount(0)
        } else {
          setAmount(Math.abs(parseFloat(value) - parseFloat(initialAmount)));
        }
      } else {
        setAmount(parseFloat(value) + parseFloat(initialAmount));
      }

    } else {
      setAmount(initialAmount);
    }
  }
  useEffect(() => {
    handleAmount(inputVal)
  }, [deduction])

  useEffect(() => {
    if (amount) {
      const parts = amount?.toString()?.split('.');
      const decimalDigits = parts?.length > 1 ? parts[1]?.slice(0, 2) : '';
      const formattedAmount = parts[0] + (decimalDigits ? '.' + decimalDigits : '');
      setAmount(formattedAmount);
    }
  }, [amount])


  const today = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const customFilter = (option, inputValue) => {
    const label = option.label?.toLowerCase() || '';
    const email = option.data.email?.toLowerCase() || '';
    const number = option.data.number?.toString().toLowerCase() || '';
    const input = inputValue.toLowerCase();

    return (
      email.includes(input) ||
      number.includes(input) ||
      label.includes(input)
    );
  };
  const customNoOptionsMessage = () => {
    return "No user found";
  };
  const [isQRScanEnabled, setIsQRScanEnabled] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const handleQRData = (data) => {
    //console.log('QR Code scanned:', data);
    // Process the scanned data
  };
  const methods = [
    { id: "cash", label: "Cash" },
    { id: "upi", label: "UPI" },
    { id: "bank", label: "Bank Transfer" },
    { id: "card", label: "Card" }
  ]

  const HandleSendAlerts = async () => {
    const template = 'Transaction Credit'
    const values = {
      // name: capitilize(userId?.label),
      name: (userId?.label),
      credits: newCredit,
      ctCredits: amount,
    };
    await handleWhatsappAlert(userId?.number, values, template)
  }
  const UpdateBalance = async (e) => {
    if (newCredit) {
      await axios.post(`${api}add-balance`, {
        amount,
        assign_by: UserData?.id,
        user_id: userId?.value ?? id,
        newCredit,
        deduction,
        payment_method: paymentMethod
      }, {
        headers: {
          'Authorization': 'Bearer ' + authToken,
        }
      }).then((response) => {
        if (response.data.status) {
          setResData(response.data)
          UserCredits(userId?.value)
          HandleSendAlerts()
          successAlert('Success', response.data.message)
        }
      }).catch((error) => {
        console.log(error);
      });
    }
  }
  return (
    <>
      <Row>
        <Col md="6">
          <div className="iq-scroller-effect">
            <Row>
              {!id && (
                <>
                  <Col md="12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-dark">Search User: *</span>
                      <div>
                        <Form.Check
                          type="switch"
                          id="qr-scan-switch"
                          className='text-dark'
                          label="QR Scan"
                          checked={isQRScanEnabled}
                          onChange={(e) => setIsQRScanEnabled(e.target.checked)}
                        />
                      </div>
                    </div>
                  </Col>
                  {isQRScanEnabled ? (
                    <Col md="12">
                      {/* <QRScanner
                        onScan={handleQRData}
                        scanMode={isQRScanEnabled}
                        styles={{ height: '400px' }}
                      /> */}
                    </Col>
                  ) : (
                    <Col md="12">
                      <div className="form-group custom-choicejs">
                        <Select
                          options={UserList}
                          styles={customStyles}
                          filterOption={customFilter}
                          isSearchable
                          onInputChange={(value) => setInputValue(value)}
                          noOptionsMessage={customNoOptionsMessage}
                          onChange={(e) => setUserId(e)}
                          menuIsOpen={inputValue.length > 0}
                          required
                        />
                      </div>
                      <span className="text-muted">User can search via name, mobile number or email</span>
                    </Col>
                  )}
                </>
              )}
            </Row>
            <Col md="12">
              <div className="mb-2">
                <h2 className="counter">
                  <CountUp
                    start={0}
                    end={(userData?.total_credits || 0) + (parseFloat(amount) || 0)}
                    duration={1}
                    useEasing={true}
                    separator=","
                  />
                </h2>
                <small>{today()}</small>
              </div>
            </Col>
          </div>
        </Col>
        <Col md="6">
          <div className="iq-scroller-effect">
            <Row>
              <Col md="12">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-dark">Enter Credits</span>
                  <span className="badge rounded-pill bg-primary-subtle">
                    {userData?.name}
                  </span>
                </div>
              </Col>
            </Row>
            <Col md="12">
              <div className="form-group custom-choicejs">
                <input
                  type="number"
                  className="form-control"
                  name="ticket quantity"
                  placeholder=""
                  onKeyDown={(event) => {
                    const { key, target } = event;
                    if (key === 'Backspace' || key === 'ArrowLeft' || key === 'ArrowRight') {
                      return;
                    }
                    if (!(/^\d$/.test(event.key) || event.key === '.')) {
                      event.preventDefault();
                    } else if (target.value.includes('.')) {
                      const decimalIndex = target.value.indexOf('.');
                      const decimalPart = target.value.substring(decimalIndex + 1);
                      if (decimalPart.length >= 2) {
                        event.preventDefault();
                      }
                    } else {
                      return
                    }
                  }}
                  onChange={(e) => handleAmount(parseFloat(e.target.value))}
                />
                {/* <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Check className="form-check d-inline-block pt-1 mb-0">
                    <input type="checkbox" className="form-check-input" id="customCheck11" onChange={(e) => setDeduction(e.target.checked)} />
                    <Form.Label className="form-check-label" htmlFor="customCheck11">Deduction</Form.Label>
                  </Form.Check>
                </div> */}
              </div>
            </Col>
            <Col md="12">
              <div className="payment-methods my-3">
                <p className="text-dark mb-3">Select Payment Method:</p>
                <Row>
                  {methods?.map(({ id, label }) => (
                    <Col xs="6" md="3" key={id}>
                      <Form.Check
                        type="radio"
                        id={id}
                        name="paymentMethod"
                        label={label}
                        onChange={() => setPaymentMethod(id)}
                        checked={paymentMethod === id}
                        className="payment-option text-dark"
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>

            <Button className="btn btn-primary w-100 mt-2"
              onClick={() => UpdateBalance()}
              disabled={(!id && !userId?.value) || !newCredit || newCredit <= 0}
            >
              Submit
            </Button>
          </div>
        </Col>
      </Row>
      {userData && (
        <Row className='mt-3'>
          <Col md="12">
            <h6 className='mb-2 text-center'>User Detail</h6>
            <div className="border-bottom border-2 border-dotted mb-3"></div>
          </Col>
          <Col xs="6" md="3" className="mb-3">
            <div className="detail-item">
              <label className="text-muted mb-1 d-flex align-items-center gap-2">
                <User size={16} />
                <span>Name</span>
              </label>
              <h6>{userData?.user?.name || 'N/A'}</h6>
            </div>
          </Col>
          <Col xs="6" md="3" className="mb-3">
            <div className="detail-item">
              <label className="text-muted mb-1 d-flex align-items-center gap-2">
                <Mail size={16} />
                <span>Email</span>
              </label>
              <h6 className="text-truncate">{userData?.user?.email || 'N/A'}</h6>
            </div>
          </Col>
          <Col xs="6" md="3" className="mb-3">
            <div className="detail-item">
              <label className="text-muted mb-1 d-flex align-items-center gap-2">
                <Phone size={16} />
                <span>Mobile Number</span>
              </label>
              <h6>{userData?.user?.number || 'N/A'}</h6>
            </div>
          </Col>
          <Col xs="6" md="3" className="mb-3">
            <div className="detail-item">
              <label className="text-muted mb-1 d-flex align-items-center gap-2">
                <WalletIcon size={16} />
                <span>Current Balance</span>
              </label>
              <h6 className="text-primary">₹ {userData?.total_credits?.toLocaleString() || '0'}</h6>
            </div>
          </Col>
        </Row>
      )}
    </>
  )
}

export default AgentCredit

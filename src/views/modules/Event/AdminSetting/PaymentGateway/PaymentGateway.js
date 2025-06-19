import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Tab, Nav, Form } from 'react-bootstrap'
import RazorPay from './RazorPay';
import Instamozo from './Instamozo';
import Easebuzz from './Easebuzz';
import Paytm from './Paytm';
import Stripe from './Stripe';
import PayPal from './PayPal';
import axios from 'axios';
import Select from "react-select";
import { useMyContext } from '../../../../../Context/MyContextProvider';

const PaymentGateway = () => {
    const { api, UserData, authToken, UserList, userRole } = useMyContext();

    const [gateways, setGateways] = useState([])
    const [user, setUser] = useState();
    const HandleUser = (data) => {
        setUser(data?.value);
    }
    let Menu = [
        {
            eventKey: 'first',
            title: 'Razorpay',
        },
        {
            eventKey: 'second',
            title: 'Instamojo',
        },
        {
            eventKey: 'third',
            title: 'Easebuzz',
        },
        {
            eventKey: 'four',
            title: 'Paytm',
        },
        {
            eventKey: 'five',
            title: 'Stripe',
        },
        {
            eventKey: 'six',
            title: 'PayPal',
        },
        {
            eventKey: 'seven',
            title: 'PhonePe',
        },
    ];

    const fetchPaymentGateways = async () => {
        let id = user ? user : UserData?.id;
        try {
            const response = await axios.get(`${api}payment-gateways/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            const gateways = response.data.gateways;
            setGateways(gateways)
        } catch (error) {
            console.error('Failed to fetch payment gateways:', error);
        }
    };

    useEffect(() => {
        fetchPaymentGateways()
    }, [user]);


    return (
        <Row>
            {userRole === 'Admin' &&
                <Col xs={12} className="mb-3">
                    <Card>
                        <Card.Body className="pb-0">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h4 className="bd-title">Payment Gateways</h4>
                                <Form.Group className="col-md-3 form-group">
                                    {/* <Form.Label htmlFor="gstvat">Account Manager :</Form.Label> */}
                                    <Select
                                        options={UserList}
                                        className="js-choice"
                                        select="one"
                                        onChange={HandleUser}
                                        menuPortalTarget={document.body}
                                        styles={{
                                            menuPortal: base => ({ ...base, zIndex: 9999 })
                                        }}
                                    />
                                </Form.Group>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            }
            <Col xs={12}>
                <Tab.Container defaultActiveKey="first">
                    <Tab.Content>
                        <Tab.Pane
                            eventKey="first"
                            className=" bd-heading-1 fade show "
                            id="content-Navs-prv"
                            role="tabpanel"
                            aria-labelledby="typo-output"
                        >
                            <div className="bd-example">
                                <Tab.Container defaultActiveKey="first">
                                    <div className="d-flex align-items-start gap-3">

                                        <Col lg="2">
                                            <Card className=" iq-document-card">
                                                <Card.Body>
                                                    <Nav
                                                        className="flex-column nav-pills nav-iconly gap-3"
                                                        role="tablist"
                                                        aria-orientation="vertical"
                                                    >
                                                        {Menu?.map((item, index) => (
                                                            <Nav.Link
                                                                key={index}
                                                                eventKey={item?.eventKey}
                                                                data-bs-toggle="pill"
                                                                data-bs-target="#v-pills-home"
                                                                type="button"
                                                                role="tab"
                                                                aria-controls="v-pills-home"
                                                                aria-selected="true"
                                                            >
                                                                {item?.title}
                                                            </Nav.Link>
                                                        ))}
                                                    </Nav>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col lg="9">
                                            <Card className=" iq-document-card">
                                                <Card.Body>
                                                    <Tab.Content className="iq-tab-fade-up">
                                                        <Tab.Pane
                                                            eventKey="first"
                                                            className="fade"
                                                            role="tabpanel"
                                                            aria-labelledby="v-pills-home-tab"
                                                        >
                                                            <RazorPay user={user} gateway={gateways.razorpay} />
                                                        </Tab.Pane>
                                                        <Tab.Pane
                                                            eventKey="second"
                                                            className="fade"
                                                            role="tabpanel"
                                                            aria-labelledby="v-pills-profile-tab"
                                                        >
                                                            <Instamozo user={user} gateway={gateways?.instamojo} />
                                                        </Tab.Pane>
                                                        <Tab.Pane
                                                            eventKey="third"
                                                            className="fade"
                                                            role="tabpanel"
                                                            aria-labelledby="v-pills-messages-tab"
                                                        >
                                                            <Easebuzz user={user} gateway={gateways.easebuzz} />
                                                        </Tab.Pane>
                                                        <Tab.Pane
                                                            eventKey="four"
                                                            className="fade"
                                                            role="tabpanel"
                                                            aria-labelledby="v-pills-settings-tab"
                                                        >
                                                            <Paytm user={user} gateway={gateways.paytm} />
                                                        </Tab.Pane>
                                                        <Tab.Pane
                                                            eventKey="five"
                                                            className="fade"
                                                            role="tabpanel"
                                                            aria-labelledby="v-pills-settings-tab"
                                                        >
                                                            <Stripe user={user} gateway={gateways.stripe} />
                                                        </Tab.Pane>
                                                        <Tab.Pane
                                                            eventKey="six"
                                                            className="fade"
                                                            role="tabpanel"
                                                            aria-labelledby="v-pills-settings-tab"
                                                        >
                                                            <PayPal user={user} gateway={gateways.paypal} />
                                                        </Tab.Pane>
                                                        {/* <Tab.Pane
                                                        eventKey="seven"
                                                        className="fade"
                                                        role="tabpanel"
                                                        aria-labelledby="v-pills-settings-tab"
                                                    >
                                                       <PhonePe/>
                                                    </Tab.Pane> */}
                                                    </Tab.Content>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </div>
                                </Tab.Container>
                            </div>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Col>
        </Row>
    )
}

export default PaymentGateway
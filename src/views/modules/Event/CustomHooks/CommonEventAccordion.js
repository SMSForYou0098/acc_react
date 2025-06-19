import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Accordion, Card, Col, Form, Row } from 'react-bootstrap'
import { useMyContext } from '../../../../Context/MyContextProvider';
import PosEvents from '../POS/PosEvents';
import { SearchIcon } from 'lucide-react';

const CommonEventAccordion = ({ setTickets, setSelectedTicketID = null, showLoader, handleAgentClick, comp }) => {
    const { api, authToken } = useMyContext()
    const [searchTerm, setSearchTerm] = useState('');
    const [event, setEvent] = useState([]);
    const [activeKey, setActiveKey] = useState('0');
    
    const handleButtonClick = (id) => {
        if (comp === 'Agent') {
            handleAgentClick(id);
        }
        getEventData(id)
        setActiveKey(null);
    };

    useEffect(() => {
        setSelectedTicketID(null);
    }, [event]);


    const getEventData = async (id) => {

        if (id) {
            const loadingAlert = showLoader(0, "Fetching tickets...");
            await axios.get(`${api}event-detail/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            })
                .then((res) => {
                    if (res.data.status) {
                        setEvent(res.data.events)
                        setTickets(res.data.events?.tickets)
                    }
                }).catch((err) =>
                    console.log(err)
                )
            loadingAlert.close();
        }
    }

    return (
        <Row>
            <Col lg="12">
                <Card>
                    <Card.Body className="py-0">
                        <Accordion flush className="p-0" activeKey={activeKey} onSelect={(e) => setActiveKey(e)}>
                            <Accordion.Item eventKey="0" className="bg-transparent">
                                <Accordion.Header>Events</Accordion.Header>
                                <Accordion.Body className="bg-transparent p-0 pt-3">
                                    <Row>
                                        <Col lg="12">
                                            <Form>
                                                <Row>
                                                    <Col lg="12">
                                                        <Form.Group className="mb-3 form-group input-group search-input w-100">
                                                            <input
                                                                type="search"
                                                                className="form-control"
                                                                placeholder="Search Your Event..."
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}

                                                            />
                                                            <span className="input-group-text">
                                                                <SearchIcon size={16}/>
                                                            </span>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </Col>
                                        <Col lg="12">
                                            <PosEvents searchTerm={searchTerm} handleButtonClick={handleButtonClick} />
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default CommonEventAccordion

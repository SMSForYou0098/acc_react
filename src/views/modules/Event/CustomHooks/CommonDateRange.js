import * as moment from 'moment';
import React from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import Flatpickrr from "react-flatpickr";
const CommonDateRange = ({ setState, setType, showSwitch }) => {

 

    const HandleDateRange = (dates) => {
        if (dates.length === 1) {
            const singleDate = moment(dates[0]);
            if (singleDate?.isValid()) {
                return singleDate?.format('YYYY-MM-DD');
            } else {
                return null;
            }
        } else if (dates.length === 2) {
            const formattedDates = dates
                ?.filter(date => moment(date)?.isValid())
                ?.map(date => moment(date)?.format('YYYY-MM-DD'));
            return formattedDates?.join(',');
        } else {
            return null;
        }
    };
    const HandleChecked = (checked) => {
        if (checked) {
            setType('all')
        } else {
            setType('active')
        }
    };
    return (
        <div>
            <Card.Header className="p-0">
                <Row className="align-items-center">
                    <Col xs={'auto'} md={'auto'} lg={'auto'}>
                        <Flatpickrr
                            options={{ mode: 'range' }}
                            className="form-control flatpickrdate"
                            placeholder="Select Date..."
                            onChange={(date) => setState(HandleDateRange(date))}
                        />
                    </Col>
                    {showSwitch && (
                        <Col xs={'auto'} md={'auto'} lg={'auto'}>
                            <Form.Group className="form-group">
                                <Form.Check className="form-switch">
                                    <Form.Check.Input
                                        type="checkbox"
                                        className="me-2"
                                        id="flexSwitchCheckDefault"
                                        onChange={(e) => HandleChecked(e.target.checked)}
                                    />
                                    <Form.Check.Label htmlFor="flexSwitchCheckDefault">
                                        All Events
                                    </Form.Check.Label>
                                </Form.Check>
                            </Form.Group>
                        </Col>
                    )}
                </Row>

            </Card.Header>
        </div>
    )
}

export default CommonDateRange

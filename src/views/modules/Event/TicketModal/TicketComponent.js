import React from 'react'
import { useParams } from 'react-router-dom';
import TicketByEvent from '../Events/DashboardEvents/TicketByEvent';
import { Card } from 'react-bootstrap';

const TicketComponent = () => {
    const { id, name } = useParams();
    return (
        <Card>
            <Card.Body>
                <TicketByEvent eventId={id} eventName={name} showEventName={true}/>
            </Card.Body>
        </Card>
    )
}

export default TicketComponent

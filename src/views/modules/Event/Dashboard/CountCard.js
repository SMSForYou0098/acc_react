import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';

const CountCard = ({ title, amount, note, hideCurrency }) => {
    return (

        <Card className="card-block card-stretch card-height">
            <Card.Body className='py-2'>
                <div className="mb-2 d-flex justify-content-between align-items-center">
                    <span className="text-dark">{title}</span>
                </div>
                <h4 className="counter">
                    {hideCurrency ? '' : '₹'}
                    <CountUp
                        start={0}
                        end={amount || 0}
                        duration={3}
                        useEasing={true}
                        separator=","
                    />
                </h4>
                {note !== '' && <small>{note}</small>}
            </Card.Body>
        </Card>
    );
};

export default CountCard;

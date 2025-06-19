import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import TicketCanvas from '../Events/Tickets/Ticket_canvas';
import { FaTimes } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useMyContext } from '../../../../Context/MyContextProvider';
import AmusementTicket from '../Events/Tickets/AmusementTicket';
import AccreditationTicket from '../Events/Tickets/AccreditationTicket';
import TicketCanvasBatch from '../Events/Tickets/TicketCanvasBatch';
const TicketModal = (props) => {
    const { showPrintButton, showTicketDetails, show, handleCloseModal, ticketType, ticketData, formatDateRange, isAccreditation } = props;
    const { convertTo12HourFormat,isMobile } = useMyContext()

    const RetriveName = (data) => {
        return data?.attendee?.Name ||
            data?.bookings?.[0]?.attendee?.Name ||
            data?.user?.name ||
            data?.bookings?.[0]?.user?.name ||
            'N/A';
    };
    const RetriveUser = (data) => {
        return data?.attendee ||
            data?.bookings?.[0]?.attendee ||
            data?.user ||
            data?.bookings?.[0]?.user ||
            'N/A';
    };
    const RetriveNumber = (data) => {
        return data?.attendee?.Mo ||
            data?.bookings?.[0]?.attendee?.Mo ||
            data?.user?.number ||
            data?.bookings?.[0]?.user?.number ||
            'N/A';
    };
    const category = ticketData?.ticket?.event?.category || (ticketData?.bookings && ticketData?.bookings[0]?.ticket?.event?.category)
    const isAmusementTicket = category === 18

    const Ticket = isAmusementTicket ? AmusementTicket : isAccreditation ? AccreditationTicket : TicketCanvas

    return (
        <Modal show={show} onHide={() => handleCloseModal()} size={ticketType?.type === 'zip' ? 'xl' : ''}>
            <Modal.Body>
                <button
                    type="button"
                    onClick={() => handleCloseModal()}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        zIndex: '99999',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: 'black',
                    }}
                >
                    <FaTimes />
                </button>
                <Row>
                    <Col lg="12">
                        {ticketType?.type === 'individual' ? (
                            ticketData?.bookings?.length > 0 && (
                                <Swiper autoplay={true} spaceBetween={10} slidesPerView={1} navigation>
                                    <div className="d-flex gap-2 flex-column justify-content-center">
                                        {ticketData.bookings.map((item, index) => {
                                            // Safely extract event and ticket data
                                            const event = item?.ticket?.event || {};
                                            const ticket = item?.ticket || {};

                                            return (
                                                <SwiperSlide className="card-slide" key={index}>
                                                    <Col lg={12} md={12} xl={12}>
                                                        <div>
                                                            <Ticket
                                                                showDetails={showTicketDetails}
                                                                showPrintButton={showPrintButton}
                                                                category={event.category || 'N/A'}
                                                                title={event.name || 'Event Name'}
                                                                number={item?.user?.number}
                                                                user={item?.user}
                                                                ticketBG={ticket.background_image || ''}
                                                                ticketName={ticket.name || 'Ticket'}
                                                                date={formatDateRange(item?.booking_date || event.date_range) || 'Date Not Available'}
                                                                city={event.city || 'City'}
                                                                address={event.address || 'Address Not Specified'}
                                                                time={convertTo12HourFormat(event.start_time) || 'Time Not Set'}
                                                                OrderId={item?.order_id || item?.token || 'N/A'}
                                                                quantity={1}
                                                            />
                                                        </div>
                                                        <p className="text-center text-secondary">{index + 1}</p>
                                                    </Col>
                                                </SwiperSlide>
                                            );
                                        })}
                                    </div>
                                </Swiper>
                            )
                        ) : ticketType?.type === 'combine' ? (
                            <div className="d-flex gap-2 flex-column">
                                <Col lg={12} md={12} xl={12}>
                                    <div>
                                        {/* Safely extract data with fallback values */}
                                        <Ticket
                                            showDetails={showTicketDetails}
                                            showPrintButton={showPrintButton}
                                            number={RetriveNumber(ticketData)}
                                            userName={RetriveName(ticketData)}
                                            user={RetriveUser(ticketData)}
                                            photo={
                                                ticketData?.attendee?.Photo ||
                                                ticketData?.bookings?.[0]?.attendee?.Photo ||
                                                'N/A'
                                            }
                                            ticketName={
                                                ticketData?.ticket?.name ||
                                                ticketData?.bookings?.[0]?.ticket?.name ||
                                                'Ticket Name'
                                            }
                                            category={
                                                ticketData?.ticket?.event?.category ||
                                                ticketData?.bookings?.[0]?.ticket?.event?.category ||
                                                'Category'
                                            }
                                            ticketBG={
                                                ticketData?.ticket?.background_image ||
                                                ticketData?.bookings?.[0]?.ticket?.background_image ||
                                                ''
                                            }
                                            title={
                                                ticketData?.ticket?.event?.name ||
                                                ticketData?.bookings?.[0]?.ticket?.event?.name ||
                                                'Event Name'
                                            }
                                            date={
                                                formatDateRange(
                                                    (ticketData?.booking_date ||
                                                        ticketData?.bookings?.[0]?.booking_date) ||
                                                    (ticketData?.ticket?.event?.date_range ||
                                                        ticketData?.bookings?.[0]?.ticket?.event?.date_range)
                                                ) || 'Date Not Available'
                                            }
                                            city={
                                                ticketData?.ticket?.event?.city ||
                                                ticketData?.bookings?.[0]?.ticket?.event?.city ||
                                                'City'
                                            }
                                            address={
                                                ticketData?.ticket?.event?.address ||
                                                ticketData?.bookings?.[0]?.ticket?.event?.address ||
                                                'Address Not Specified'
                                            }
                                            time={
                                                convertTo12HourFormat(
                                                    ticketData?.ticket?.event?.start_time ||
                                                    ticketData?.bookings?.[0]?.ticket?.event?.start_time
                                                ) || 'Time Not Set'
                                            }
                                            OrderId={ticketData?.order_id || ticketData?.token || 'N/A'}
                                            quantity={ticketData?.bookings?.length || 1}
                                        />
                                    </div>
                                </Col>
                            </div>
                        ) : ticketType?.type === 'zip' ? (
                            <TicketCanvasBatch
                                isMobile={isMobile}
                                ticketData={ticketData}
                                formatDateRange={formatDateRange}
                                convertTo12HourFormat={convertTo12HourFormat}
                            />
                        ) : null}
                    </Col>
                </Row>

            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>

    );
}


export default TicketModal;
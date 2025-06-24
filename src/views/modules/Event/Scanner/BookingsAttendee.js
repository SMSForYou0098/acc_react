import { Card, Row, Col, Carousel, Image } from "react-bootstrap";
import { Edit as EditIcon, Trash as DeleteIcon, ChevronRight, ChevronLeft } from "lucide-react";
import { useRef, useState } from "react";
import { PRIMARY } from "../CustomUtils/Consts";
// import { PRIMARY } from "../../../CustomUtils/Consts";
const formatFieldName = (name) => {
    if (!name) return "";
    return name
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
};
const AttendeeCard = ({ attendee, index, apiData, handleOpenModal, handleDeleteAttendee, ShowAction }) => (
    <div className={`custom-dotted-border m-2 rounded-3 ${attendee?.missingFields?.length > 0 ? 'border-danger' : ''}`}>
        <Card.Header className="d-flex justify-content-end">
            {/* Attendee Details - Ticket {index + 1} */}
            {/* Attendee - {index + 1} */}
            {ShowAction && (
                <div className="d-flex gap-2">
                    <div className="cursor-pointer" onClick={() => handleOpenModal(index)}>
                        <EditIcon size={16} />
                    </div>
                    <div className="cursor-pointer" onClick={() => handleDeleteAttendee(index)}>
                        <DeleteIcon size={16} />
                    </div>
                </div>
            )}
        </Card.Header>
        <Card.Body>
            <Row>
                {/* First Row: Centered Image (If Any) */}
                {apiData?.some(field =>
                    attendee[field?.field_name] instanceof File ||
                    (typeof attendee[field?.field_name] === "string" &&
                        (attendee[field?.field_name].startsWith("http://") || attendee[field?.field_name].startsWith("https://")) &&
                        /\.(jpg|jpeg|png|gif|bmp|webp|ico)$/i.test(attendee[field?.field_name]))
                ) && (
                        <Col xs={12} className="d-flex justify-content-center mb-3">
                            {apiData?.map((field, fieldIndex) => {
                                const imageUrl =
                                    attendee[field?.field_name] instanceof File
                                        ? URL.createObjectURL(attendee[field?.field_name])
                                        : (typeof attendee[field?.field_name] === "string" &&
                                            (attendee[field?.field_name].startsWith("http://") || attendee[field?.field_name].startsWith("https://")) &&
                                            /\.(jpg|jpeg|png|gif|bmp|webp|ico)$/i.test(attendee[field?.field_name]))
                                            ? attendee[field?.field_name]
                                            : null;

                                return imageUrl ? (
                                    <Image
                                        key={fieldIndex}
                                        src={imageUrl}
                                        alt={`${field?.field_name} preview`}
                                        style={{ width: '205px', height: '205px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                ) : null;
                            })}
                        </Col>
                    )}

                {/* Second Row: Other Details in 3x3 Grid */}
                {apiData?.map((field, fieldIndex) => {
                    const isImage =
                        attendee[field?.field_name] instanceof File ||
                        (typeof attendee[field?.field_name] === "string" &&
                            (attendee[field?.field_name].startsWith("http://") || attendee[field?.field_name].startsWith("https://")) &&
                            /\.(jpg|jpeg|png|gif|bmp|webp|ico)$/i.test(attendee[field?.field_name]));

                    return !isImage ? (
                        <Col xs={6} md={4} key={fieldIndex} className="text-black mb-2">
                            <strong>{formatFieldName(field?.field_name)}: </strong>
                            {typeof attendee[field?.field_name] !== 'object' ? (
                                attendee[field?.field_name] !== null && attendee[field?.field_name]
                            ) : (
                                <span className="text-muted">[File]</span>
                            )}
                        </Col>
                    ) : null;
                })}
            </Row>

            {ShowAction && attendee?.missingFields?.length > 0 && (
                <div className="text-danger">
                    <p><strong>Missing Fields:</strong> {attendee.missingFields.join(', ')}</p>
                </div>
            )}
        </Card.Body>
    </div>
);

const BookingsAttendee = ({ attendeeList, apiData, handleOpenModal, handleDeleteAttendee, ShowAction, Slider }) => {
    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);

    const handleDragStart = (e) => {
        setIsDragging(true);
        setStartX(e.clientX || e.touches[0].clientX);
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;
        const currentX = e.clientX || e.touches[0].clientX;
        const diff = startX - currentX;

        if (diff > 50) {
            carouselRef.current.next();
            setIsDragging(false);
        } else if (diff < -50) {
            carouselRef.current.prev();
            setIsDragging(false);
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };
    const showNavigator = attendeeList?.length > 1
    return (
        <div style={{ maxHeight: '35rem', overflowX: 'hidden', overflowY: 'auto' }}>
            {Slider ? (
                <div className="position-relative">
                    {/* Left Arrow */}
                    {showNavigator &&
                        <button
                            className="position-absolute top-50 start-0 translate-middle-y border-0 p-1 rounded-circle shadow"
                            style={{ zIndex: 10 }}
                            onClick={() => carouselRef.current.prev()}
                        >
                            <ChevronLeft size={25} color={PRIMARY} />
                        </button>
                    }

                    <Carousel
                        ref={carouselRef}
                        interval={null}
                        onMouseDown={handleDragStart}
                        onMouseMove={handleDragMove}
                        onMouseUp={handleDragEnd}
                        onTouchStart={handleDragStart}
                        onTouchMove={handleDragMove}
                        onTouchEnd={handleDragEnd}
                        indicators={false}
                    >
                        {attendeeList?.map((attendee, index) => (
                            <Carousel.Item key={index}>
                                <AttendeeCard
                                    key={index}
                                    attendee={attendee}
                                    index={index}
                                    apiData={apiData}
                                    handleOpenModal={handleOpenModal}
                                    handleDeleteAttendee={handleDeleteAttendee}
                                    ShowAction={ShowAction}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>

                    {/* Right Arrow */}
                    {showNavigator &&
                        <button
                            className="position-absolute top-50 end-0 translate-middle-y border-0 p-1 rounded-circle shadow"
                            style={{ zIndex: 10 }}
                            onClick={() => carouselRef.current.next()}
                        >
                            <ChevronRight size={25} color={PRIMARY} />
                        </button>
                    }
                </div>
            ) : (
                attendeeList?.map((attendee, index) => (
                    <AttendeeCard
                        key={index}
                        attendee={attendee}
                        index={index}
                        apiData={apiData}
                        handleOpenModal={handleOpenModal}
                        handleDeleteAttendee={handleDeleteAttendee}
                        ShowAction={ShowAction}
                    />
                ))
            )}
        </div>
    );
};

export default BookingsAttendee;

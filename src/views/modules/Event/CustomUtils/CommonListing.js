import React, { Fragment } from 'react'
import MobBookingButton from './BookingUtils/MobBookingButton'
import { useMyContext } from '../../../../Context/MyContextProvider'
import { Card, Col, Row } from 'react-bootstrap';
import BookingCount from '../Events/Bookings/BookingCount';
import CustomDataTable from '../Wallet/CustomDataTable';

const CommonListing = (props) => {
    const { bookings, dateRange, loading, columns, setDateRange, bookingLink, tile, exportPermisson, ButtonLable, ShowReportCard = true,searchPlaceholder,showGatewayAmount,ignoredColumnsProp } = props;
    const { UserPermissions, isMobile } = useMyContext();
    return (
        <Fragment>
            {/* print model  */}

            {isMobile &&
                <MobBookingButton to={bookingLink} />
            }
            {/* print model end */}
            <Row>
                {ShowReportCard && (
                    <Col xs={12} md={12} lg={12}>
                        <Row>
                            <BookingCount data={bookings} date={dateRange} type={tile} showGatewayAmount={showGatewayAmount}/>
                        </Row>
                    </Col>
                )}
                <Col sm="12">
                    <Card>
                        <Row className="d-flex align-items-center">
                        </Row>
                        <Card.Body className="px-0">
                            <CustomDataTable
                                tile={tile}
                                setDateRange={setDateRange}
                                bookingLink={bookingLink}
                                buttonLable={ButtonLable}
                                data={bookings}
                                ExportPermisson={UserPermissions.includes(exportPermisson)}
                                columns={columns}
                                ignoredColumnsProp={ignoredColumnsProp}
                                loading={loading}
                                keyField="id"
                                searchPlaceholder={searchPlaceholder || "Search bookings..."}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}

export default CommonListing

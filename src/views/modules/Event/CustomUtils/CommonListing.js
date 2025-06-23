import React, { Fragment } from 'react'
import { useMyContext } from '../../../../Context/MyContextProvider'
import { Card, Col, Row } from 'react-bootstrap';
import CustomDataTable from '../CustomHooks/CustomDataTable';

const CommonListing = (props) => {
    const { data,  loading, columns, setDateRange, bookingLink, tile, exportPermisson, ButtonLable,searchPlaceholder,ignoredColumnsProp } = props;
    const { UserPermissions } = useMyContext();
    return (
        <Fragment>
            {/* print model end */}
            <Row>
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
                                data={data}
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

import React from 'react'
import { Button, Card, InputGroup, Form, Row, Col, } from 'react-bootstrap'
// import { useMyContext } from '../../../../Context/MyContextProvider'
import { Link } from 'react-router-dom'
import CommonDateRange from '../CustomHooks/CommonDateRange'
import { FileDown, PlusIcon, Search } from 'lucide-react'
// import { FiDownload, FiSearch } from 'react-icons/fi'

const CommonHeader = (props) => {
    const { tile, setDateRange, bookingLink, buttonLable, searchPlaceholder, handleExport, searchTerm, setSearchTerm, ExportPermisson, disableExport } = props
    // const { isMobile } = useMyContext()
    return (
        <Card.Header className="mb-2 pt-0">
            <div className={`d-flex flex-column flex-md-row justify-content-md-between align-items-md-center`}>
                {/* Title Section */}
                <div className="header-title mb-3 mb-md-0">
                    <h4 className="card-title mb-0">{tile}</h4>
                </div>

                {/* Controls Section */}
                <div className="controls-wrapper flex-grow-1 flex-md-grow-0 ms-md-3">
                    <Row className="g-3">
                        {setDateRange &&
                            <Col md={'auto'} sm={12} xs={6}>
                                <CommonDateRange setState={setDateRange} removeClass={true} />
                            </Col>
                        }
                        <Col md={'auto'} sm={12} xs={6}>
                            <InputGroup className="position-relative">
                                <Form.Control
                                    className="py-2"
                                    placeholder={searchPlaceholder}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer">
                                    <Search size={16} />
                                </span>
                            </InputGroup>
                        </Col>
                        {ExportPermisson && (
                            <Col md={'auto'} sm={12} xs={6}>
                                <Button
                                    variant="outline-primary rounded-pill"
                                    onClick={handleExport}
                                    disabled={disableExport}
                                    className="d-flex align-items-center gap-2 w-100 justify-content-center"
                                >
                                    <FileDown size={16} />
                                    Export
                                </Button>
                            </Col>
                        )}
                        {buttonLable &&
                            <Col md={'auto'} sm={12} xs={6}>
                                <div className="booking-button">
                                    <Link to={bookingLink} className="w-100 d-block">
                                        <Button className="hvr-curl-top-right border-0 w-100">
                                            <PlusIcon size={22} /> {buttonLable}
                                        </Button>
                                    </Link>
                                </div>
                            </Col>
                        }

                    </Row>
                </div>
            </div>
        </Card.Header>
    )
}

export default CommonHeader

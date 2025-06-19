import React from 'react'
import { Col, Form } from 'react-bootstrap'

const SiteSettings = (props) => {
    const { appName, setLogo, setAuthLogo, setFavicon, setAppName, complimentaryValidation, setComplimentaryValidation, missedCallNumber, setMissedCallNumber, setWaNumber, waNumber, notifyReq, setNotifyReq,setMobileLogo } = props;
    return (
        <>
            <Col lg="4">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Logo</Form.Label>
                    <Form.Control accept="image/*" type="file" id="logoFile" onChange={(e) => setLogo(e.target.files[0])} />
                </Form.Group>
            </Col>
            <Col lg="4">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Auth Logo</Form.Label>
                    <Form.Control accept="image/*" type="file" id="logoFile" onChange={(e) => setMobileLogo(e.target.files[0])} />
                </Form.Group>
            </Col>
            <Col lg="4">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Mobile Logo</Form.Label>
                    <Form.Control accept="image/*" type="file" id="logoFile" onChange={(e) => setAuthLogo(e.target.files[0])} />
                </Form.Group>
            </Col>
            <Col lg="4">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Favicon</Form.Label>
                    <Form.Control type="file" id="faviconFile" onChange={(e) => setFavicon(e.target.files[0])} />
                </Form.Group>
            </Col>
            <Col lg="4">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>App Name</Form.Label>
                    <Form.Control type="text" placeholder="App name" value={appName} onChange={(e) => setAppName(e.target.value)} />
                </Form.Group>
            </Col>
            <Col lg="4">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>WhatsApp Number</Form.Label>
                    <Form.Control type="number" placeholder="WhatsApp Number" value={waNumber} onChange={(e) => setWaNumber(e.target.value)} />
                </Form.Group>
            </Col>
            <Col lg="4">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Missed Call Number</Form.Label>
                    <Form.Control type="number" placeholder="Missed Call Number" value={missedCallNumber} onChange={(e) => setMissedCallNumber(e.target.value)} />
                </Form.Group>
            </Col>
            {/* make col for switch */}
            <Col lg="3" className='d-flex align-items-center'>
                <Form.Group className="mb-0 form-group">
                    <Form.Label>{'User Notification Permission'}</Form.Label>
                    <Form.Check type="switch">
                        <Form.Check.Input
                            checked={notifyReq}
                            onChange={(e) => setNotifyReq(e.target.checked)}
                        />
                        <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
                    </Form.Check>
                </Form.Group>
            </Col>
            <Col lg="3" className='d-flex align-items-center'>
                <Form.Group className="mb-0 form-group">
                    <Form.Label>{'Complimentary User Validation'}</Form.Label>
                    <Form.Check type="switch">
                        <Form.Check.Input
                            checked={complimentaryValidation}
                            onChange={(e) => setComplimentaryValidation(e.target.checked)}
                        />
                        <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
                    </Form.Check>
                </Form.Group>
            </Col>
        </>
    )
}

export default SiteSettings

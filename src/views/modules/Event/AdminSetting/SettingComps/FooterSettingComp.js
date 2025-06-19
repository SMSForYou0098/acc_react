import React from 'react'
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap'
import JoditEditor from 'jodit-react'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

const FooterSettingComp = (props) => {
    const { handleAppConfig, setFooterLogo, footerAddress, setFooterAddress, footerContact, setFooterContact, siteCredit, setSiteCredit,
        facebookData, setFacebookData, setInstagramData, instagramData, setYoutubeData, youtubeData, XData, setXData, footerEmail, setFooterEmail, footerWaNumber, setFooterWaNumber,setFooterBG } = props
    return (
        <Row>
            <Col lg="12">
                <h5>Footer Detail</h5>
            </Col>
            {/* Footer Logo */}
            <Col lg="6">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Footer Logo</Form.Label>
                    <Form.Control
                        type="file"
                        id="footerLogoFile"
                        accept="image/*"
                        onChange={(e) => setFooterLogo(e.target.files[0])}
                    />
                </Form.Group>
            </Col>
            <Col lg="6">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Footer Background (350 x 1980)</Form.Label>
                    <Form.Control
                        type="file"
                        id="footerBGFile"
                        accept="image/*"
                        onChange={(e) => setFooterBG(e.target.files[0])}
                    />
                </Form.Group>
            </Col>
            {/* Footer Contact */}
            <Col lg="4">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Footer Contact</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter footer contact"
                        value={footerContact}
                        onChange={(e) => setFooterContact(e.target.value)}
                    />
                </Form.Group>
            </Col>
            <Col lg="4">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Footer WhatsApp Number</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter footer number"
                        value={footerWaNumber}
                        onChange={(e) => setFooterWaNumber(e.target.value)}
                    />
                </Form.Group>
            </Col>
            <Col lg="4">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Footer Email</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter footer email"
                        value={footerEmail}
                        onChange={(e) => setFooterEmail(e.target.value)}
                    />
                </Form.Group>
            </Col>
            {/* Footer Address */}
            <Col lg="12">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Footer Address</Form.Label>
                    <JoditEditor
                        tabIndex={1}
                        value={footerAddress}
                        onChange={(newContent) => setFooterAddress(newContent)}
                    />
                </Form.Group>
            </Col>
            {/* Social Media Links */}
            <Col lg="3">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Facebook</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>
                            <Facebook size={18} />
                        </InputGroup.Text>
                        <Form.Control
                            type="url"
                            placeholder="Enter Facebook URL"
                            value={facebookData}
                            onChange={(e) => setFacebookData(e.target.value)}
                        />
                    </InputGroup>
                </Form.Group>
            </Col>

            <Col lg="3">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Instagram</Form.Label>
                    <InputGroup>
                        <InputGroup.Text><Instagram size={18} /></InputGroup.Text>
                        <Form.Control
                            type="url"
                            placeholder="Enter Instagram URL"
                            value={instagramData}
                            onChange={(e) => setInstagramData(e.target.value)}
                        />
                    </InputGroup>
                </Form.Group>
            </Col>

            <Col lg="3">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>YouTube</Form.Label>
                    <InputGroup>
                        <InputGroup.Text><Youtube size={18} /></InputGroup.Text>
                        <Form.Control
                            type="url"
                            placeholder="Enter YouTube URL"
                            value={youtubeData}
                            onChange={(e) => setYoutubeData(e.target.value)}
                        />
                    </InputGroup>
                </Form.Group>
            </Col>

            <Col lg="3">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>X (Twitter)</Form.Label>
                    <InputGroup>
                        <InputGroup.Text><Twitter size={18} /></InputGroup.Text>
                        <Form.Control
                            type="url"
                            placeholder="Enter X (Twitter) URL"
                            value={XData}
                            onChange={(e) => setXData(e.target.value)}
                        />
                    </InputGroup>
                </Form.Group>
            </Col>

            {/* Site Credit */}
            <Col lg="12">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Site Credit</Form.Label>
                    <JoditEditor
                        tabIndex={1}
                        value={siteCredit}
                        onChange={(newContent) => setSiteCredit(newContent)}
                    />
                </Form.Group>
            </Col>
            <div className='d-flex justify-content-end'>
                <Button type="button" onClick={(e) => handleAppConfig(e)}>Submit</Button>
            </div>
        </Row>
    )
}

export default FooterSettingComp

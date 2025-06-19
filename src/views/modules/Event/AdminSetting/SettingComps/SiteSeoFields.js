import React from 'react'
import { Col, Form } from 'react-bootstrap'

const SiteSeoFields = (props) => {
    const { metaDescription, copyright, copyrightLink, setMetaDescription, setCopyright, setCopyrightLink,metaTitle,setMetaTitle,metaTag,setMetaTag } = props
    return (
        <>
            <Col lg="12">
                <h5>SEO</h5>
            </Col>
            <Col lg="6">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Meta Title</Form.Label>
                    <Form.Control type="text" placeholder="" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
                </Form.Group>
            </Col>
            <Col lg="6">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Meta Tag</Form.Label>
                    <Form.Control type="text" placeholder="" value={metaTag} onChange={(e) => setMetaTag(e.target.value)} />
                </Form.Group>
            </Col>
            {/* -----------------Meta------------------ */}
            <Col lg="12">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Meta Description</Form.Label>
                    <Form.Control as="textarea" placeholder="" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
                </Form.Group>
            </Col>
            {/* ---------------------Copyright---------------------- */}
            <hr className="hr-horizontal" />
            <Col lg="12">
                <h5>Copyright</h5>
            </Col>
            <Col lg="6">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Copyright Text</Form.Label>
                    <Form.Control type="text" placeholder="" value={copyright} onChange={(e) => setCopyright(e.target.value)} />
                </Form.Group>
            </Col>
            <Col lg="6">
                <Form.Group className="mb-3 form-group">
                    <Form.Label>Copyright Url</Form.Label>
                    <Form.Control type="text" placeholder="" value={copyrightLink} onChange={(e) => setCopyrightLink(e.target.value)} />
                </Form.Group>
            </Col>
        </>
    )
}

export default SiteSeoFields

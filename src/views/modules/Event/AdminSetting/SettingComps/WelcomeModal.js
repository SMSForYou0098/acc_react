import React, { useState, useEffect } from 'react'
import { Col, Form, Button } from 'react-bootstrap'
import axios from 'axios'
import { useMyContext } from '../../../../../Context/MyContextProvider'
import { processImageFile } from '../../CustomComponents/AttendeeStroreUtils'

const WelcomeModal = () => {
    const { api, authToken, successAlert } = useMyContext()
    const [image, setImage] = useState('')
    const [smImage, setSmImage] = useState('')
    const [url, setUrl] = useState('')
    const [smUrl, setSmUrl] = useState('')
    const [compressImage, setCompressImage] = useState(false)
    const [isModalEnabled, setIsModalEnabled] = useState(false)
    const [errors, setErrors] = useState({
        image: '',
        smImage: '',
        url: '',
        smUrl: ''
    })
    const [previewUrl, setPreviewUrl] = useState({ big: '', small: '' })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${api}wc-mdl-list`, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    }
                })
                if (res.data.status) {
                    const data = res.data.data
                    setUrl(data.url || '')
                    setSmUrl(data.sm_url || '')
                    setIsModalEnabled(data.status === 1)
                    setPreviewUrl({
                        big: data.image ? data.image : '',
                        small: data.sm_image ? data.sm_image : ''
                    })
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [api, authToken])

    const handleImageChange = async (e, setImageFunction, type) => {
        const file = e.target.files[0]
        if (file) {
            if (compressImage) {
                const processedImage = await processImageFile(file)
                setImageFunction(processedImage)
            } else {
                setImageFunction(file)
            }
            setPreviewUrl(prev => ({
                ...prev,
                [type]: URL.createObjectURL(file)
            }))
        }
    }

    const validateForm = () => {
        let isValid = true
        const newErrors = {
            image: '',
            smImage: '',
            url: '',
            smUrl: ''
        }

        if (!image && !previewUrl.big) {
            newErrors.image = 'Modal Image is required'
            isValid = false
        }
        if (!smImage && !previewUrl.small) {
            newErrors.smImage = 'Small Modal Image is required'
            isValid = false
        }
        if (!url.trim()) {
            newErrors.url = 'URL is required'
            isValid = false
        }
        if (!smUrl.trim()) {
            newErrors.smUrl = 'Small Modal URL is required'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            const formData = new FormData()
            if (image) formData.append('image', image)
            if (smImage) formData.append('sm_image', smImage)
            formData.append('url', url)
            formData.append('sm_url', smUrl)
            formData.append('status', isModalEnabled ? 1 : 0)

            const res = await axios.post(`${api}wc-mdl-store`, formData, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (res.data.status) {
                successAlert('Success', 'Welcome Modal Settings Updated Successfully')
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <h4 className="mb-3">Welcome Modal Settings</h4>
            <Col sm="12" className="mb-3 d-flex align-items-center gap-5">
                <Form.Check
                    type="switch"
                    id="modal-enable-switch"
                    label="Welcome Modal Status"
                    checked={isModalEnabled}
                    onChange={(e) => setIsModalEnabled(e.target.checked)}
                    className="mb-2"
                />
                <Form.Check
                    type="switch"
                    id="compress-switch"
                    label="Compress Images"
                    checked={compressImage}
                    onChange={(e) => setCompressImage(e.target.checked)}
                />
            </Col>
            <Col sm="6" className="mb-3">
                <Form.Label>Modal Image <span className="text-muted">(600x300 px)</span></Form.Label>
                <Form.Control
                    type="file"
                    onChange={(e) => handleImageChange(e, setImage, 'big')}
                    required
                />
                {errors.image && <small className="text-danger">{errors.image}</small>}
                {previewUrl.big && (
                    <div className="mt-2" style={{ maxWidth: '150px' }}>
                        <img
                            src={previewUrl.big}
                            alt="Preview"
                            className="img-fluid"
                        />
                    </div>
                )}
            </Col>
            <Col sm="6" className="mb-3">
                <Form.Label>Small Modal Image <span className="text-muted">(300x400 px)</span></Form.Label>
                <Form.Control
                    type="file"
                    onChange={(e) => handleImageChange(e, setSmImage, 'small')}
                    required
                />
                {errors.smImage && <small className="text-danger">{errors.smImage}</small>}
                {previewUrl.small && (
                    <div className="mt-2" style={{ maxWidth: '150px' }}>
                        <img
                            src={previewUrl.small}
                            alt="Preview"
                            className="img-fluid"
                        />
                    </div>
                )}
            </Col>
            <Col sm="6" className="mb-3">
                <Form.Label>URL</Form.Label>
                <Form.Control
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
                {errors.url && <small className="text-danger">{errors.url}</small>}
            </Col>
            <Col sm="6" className="mb-3">
                <Form.Label>Small Modal URL</Form.Label>
                <Form.Control
                    type="text"
                    value={smUrl}
                    onChange={(e) => setSmUrl(e.target.value)}
                    required
                />
                {errors.smUrl && <small className="text-danger">{errors.smUrl}</small>}
            </Col>
            <Col sm="12" className="d-flex justify-content-end mb-3">
                <Button onClick={handleSubmit}>Save </Button>
            </Col>
        </>
    )
}

export default WelcomeModal

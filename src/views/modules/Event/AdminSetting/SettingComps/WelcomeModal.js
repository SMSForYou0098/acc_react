import React, { useState, useEffect } from 'react'
import { Col, Form, Button, Modal, Row, Card } from 'react-bootstrap'
import axios from 'axios'
import { useMyContext } from '../../../../../Context/MyContextProvider'
import ImageCropper from '../../Utils/ImageCropper'
import { Eye, Edit2, Link as LinkIcon, Monitor, Smartphone, Trash2 } from 'lucide-react'
import { CustomTooltip } from '../../CustomUtils/CustomTooltip'
import CustomImagePreview from './CustomImagePreview'
import { PRIMARY } from '../../CustomUtils/Consts'
import Swal from 'sweetalert2'

const WelcomeModal = () => {
    const { api, authToken, successAlert, isMobile } = useMyContext()

    const [modalData, setModalData] = useState({
        image: '',
        smImage: '',
        url: '',
        smUrl: ''
    })
    const [isModalEnabled, setIsModalEnabled] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [validated, setValidated] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({
        image: '',
        smImage: '',
        url: '',
        smUrl: ''
    })
    const [previewUrl, setPreviewUrl] = useState({ big: '', small: '' })
    const [showImageCropper, setShowImageCropper] = useState(false)
    const [cropperImageSrc, setCropperImageSrc] = useState('')
    const [cropperImageType, setCropperImageType] = useState('')
    const [cropperPreviewType, setCropperPreviewType] = useState('')
    const [modalsData, setModalsData] = useState([])
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const [previewModalData, setPreviewModalData] = useState(null)
    const [editingModalId, setEditingModalId] = useState(null)

    // Required image dimensions
    const imageDimensions = {
        big: { width: 600, height: 300 },
        small: { width: 300, height: 400 }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${api}wc-mdl-list`, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    }
                })
                if (res.data.status) {
                    // Handle both single modal data and array of modals
                    if (Array.isArray(res.data.data)) {
                        setModalsData(res.data.data)
                    } else {
                        // For backward compatibility with single modal
                        const data = res.data.data
                        setModalData(prev => ({
                            ...prev,
                            url: data.url_exc || '',
                            smUrl: data.url_sm || ''
                        }))
                        setIsModalEnabled(data.status === 1)
                        setPreviewUrl({
                            big: data.image_exc ? data.image_exc : '',
                            small: data.image_sm ? data.image_sm : ''
                        })
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [api, authToken])

    const handleImageChange = async (e, imageType, previewType) => {
        const file = e.target.files[0]
        if (file) {
            // Create an image element to check dimensions
            const img = new Image()
            img.onload = () => {
                const requiredDimensions = imageDimensions[previewType]
                const imageWidth = img.width
                const imageHeight = img.height

                // Check orientation based on image type
                if (previewType === 'big') {
                    // Modal image should be landscape (width > height)
                    if (imageWidth <= imageHeight) {
                        setErrors(prev => ({
                            ...prev,
                            [imageType]: `Modal image must be landscape (width > height). Current image is ${imageWidth}x${imageHeight} pixels.`
                        }))
                        // Clear the file input
                        e.target.value = ''
                        return
                    }
                } else if (previewType === 'small') {
                    // Mobile modal image should be portrait (height > width)
                    if (imageHeight <= imageWidth) {
                        setErrors(prev => ({
                            ...prev,
                            [imageType]: `Mobile modal image must be portrait (height > width). Current image is ${imageWidth}x${imageHeight} pixels.`
                        }))
                        // Clear the file input
                        e.target.value = ''
                        return
                    }
                }

                // Check if image is smaller than required dimensions
                if (imageWidth < requiredDimensions.width || imageHeight < requiredDimensions.height) {
                    setErrors(prev => ({
                        ...prev,
                        [imageType]: `Image must be at least ${requiredDimensions.width}x${requiredDimensions.height} pixels. Current image is ${imageWidth}x${imageHeight} pixels.`
                    }))
                    // Clear the file input
                    e.target.value = ''
                    return
                }

                // Clear any existing errors for this field
                setErrors(prev => ({
                    ...prev,
                    [imageType]: ''
                }))

                // If image is larger than required, open cropper
                if (imageWidth > requiredDimensions.width || imageHeight > requiredDimensions.height) {
                    setCropperImageSrc(URL.createObjectURL(file))
                    setCropperImageType(imageType)
                    setCropperPreviewType(previewType)
                    setShowImageCropper(true)
                } else {
                    // Image is exact size, use as is
                    setModalData(prev => ({
                        ...prev,
                        [imageType]: file
                    }))
                    setPreviewUrl(prev => ({
                        ...prev,
                        [previewType]: URL.createObjectURL(file)
                    }))
                }
            }
            img.onerror = () => {
                setErrors(prev => ({
                    ...prev,
                    [imageType]: 'Invalid image file. Please select a valid image.'
                }))
                // Clear the file input
                e.target.value = ''
            }
            img.src = URL.createObjectURL(file)
        }
    }

    const handleCropComplete = (croppedFile) => {
        setModalData(prev => ({
            ...prev,
            [cropperImageType]: croppedFile
        }))
        setPreviewUrl(prev => ({
            ...prev,
            [cropperPreviewType]: URL.createObjectURL(croppedFile)
        }))
        setShowImageCropper(false)
        setCropperImageSrc('')
        setCropperImageType('')
        setCropperPreviewType('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const form = e.currentTarget

        if (form.checkValidity() === false) {
            e.stopPropagation()
            setValidated(true)
            return
        }

        // Custom validation for images
        if (!modalData.image && !previewUrl.big) {
            setErrors(prev => ({ ...prev, image: 'Modal Image is required' }))
            return
        }
        if (!modalData.smImage && !previewUrl.small) {
            setErrors(prev => ({ ...prev, smImage: 'Mobile Modal Image is required' }))
            return
        }

        setValidated(true)
        setIsLoading(true)

        try {
            const formData = new FormData()
            if (modalData.image) formData.append('image', modalData.image)
            if (modalData.smImage) formData.append('sm_image', modalData.smImage)
            formData.append('url', modalData.url)
            formData.append('sm_url', modalData.smUrl)
            formData.append('status', isModalEnabled ? 1 : 0)

            const endpoint = editingModalId
                ? `${api}wc-mdl-update/${editingModalId}`
                : `${api}welcome-modal-store`

            const res = await axios.post(endpoint, formData, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (res.data.status) {
                successAlert('Success', editingModalId ? 'Modal updated successfully' : 'Modal created successfully')

                // Update modalsData state with API response
                if (editingModalId) {
                    setModalsData(prevModals =>
                        prevModals.map(modal =>
                            modal.id === editingModalId
                                ? { ...modal, ...res.data.data }
                                : modal
                        )
                    )
                } else {
                    // Add new modal with proper structure
                    const newModal = {
                        id: res.data.data.id,
                        image: res.data.data.image_exc || res.data.data.image,
                        sm_image: res.data.data.image_sm || res.data.data.sm_image,
                        url: res.data.data.url_exc || res.data.data.url,
                        sm_url: res.data.data.url_sm || res.data.data.sm_url,
                        status: parseInt(res.data.data.status),
                        created_at: res.data.data.created_at,
                        updated_at: res.data.data.updated_at
                    }
                    setModalsData(prev => [...prev, newModal])
                }

                resetModalData()
                setShowModal(false)
            }
        } catch (err) {
            console.log(err)
            setErrors(prev => ({ ...prev, general: 'Failed to save modal. Please try again.' }))
        } finally {
            setIsLoading(false)
        }
    }

    const resetModalData = () => {
        setModalData({
            image: '',
            smImage: '',
            url: '',
            smUrl: ''
        })
        setErrors({
            image: '',
            smImage: '',
            url: '',
            smUrl: ''
        })
        setPreviewUrl({ big: '', small: '' })
        setValidated(false)
    }

    const handleModalClose = () => {
        resetModalData()
        setShowModal(false)
        setEditingModalId(null)
    }

    // Handle status toggle for modal cards
    const handleStatusToggle = async (modalId, currentStatus) => {
        // Update local state directly since there's no API
        setModalsData(prevModals =>
            prevModals.map(modal =>
                modal.id === modalId
                    ? { ...modal, status: currentStatus === 1 ? 0 : 1 }
                    : modal
            )
        )
        successAlert('Success', 'Modal status updated successfully')

        // Comment out API call for now

        try {
            const res = await axios.post(`${api}wc-mdl-status-update/${modalId}`, {
                status: currentStatus === 1 ? 0 : 1
            }, {
                headers: {
                    'Authorization': 'Bearer ' + authToken
                }
            })

            if (res.data.status) {
                setModalsData(prevModals =>
                    prevModals.map(modal =>
                        modal.id === modalId
                            ? { ...modal, status: currentStatus === 1 ? 0 : 1 }
                            : modal
                    )
                )
                successAlert('Success', 'Modal status updated successfully')
            }
        } catch (err) {
            console.log(err)
        }

    }

    // Handle edit modal
    const handleEditModal = (modal) => {
        setEditingModalId(modal.id)
        setModalData({
            image: modal.image_exc || modal.image || '',
            smImage: modal.image_sm || modal.sm_image || '',
            url: modal.url_exc || modal.url || '',
            smUrl: modal.url_sm || modal.sm_url || ''
        })
        setPreviewUrl({
            big: modal.image_exc || modal.image || '',
            small: modal.image_sm || modal.sm_image || ''
        })
        setShowModal(true)
    }

    // Handle preview modal
    const handlePreviewModal = (modal) => {
        setPreviewModalData(modal)
        setShowPreviewModal(true)
    }

    // Handle delete modal
    const handleDeleteModal = async (modalId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        })

        if (result.isConfirmed) {
            try {
                // Update local state directly for now
                // setModalsData(prevModals =>
                //     prevModals.filter(modal => modal.id !== modalId)
                // )

                successAlert('Success', 'Modal deleted successfully')

                // Uncomment for actual API call
                
                const res = await axios.delete(`${api}wc-mdl-delete/${modalId}`, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    }
                })

                if (res.data.status) {
                    setModalsData(prevModals => 
                        prevModals.filter(modal => modal.id !== modalId)
                    )
                    successAlert('Success', 'Modal deleted successfully')
                } else {
                    Swal.fire('Error!', 'Failed to delete modal.', 'error')
                }

            } catch (err) {
                console.log(err)
                Swal.fire('Error!', 'Something went wrong while deleting the modal.', 'error')
            }
        }
    }

    return (
        <>
            <h4 className="mb-3">Welcome Modal Settings</h4>
            {/* Display existing modals */}
            <Col sm="12" className="mb-4">
                <h5 className="mb-3">Existing Modals</h5>
                <Row>
                    {modalsData?.map((modal, index) => (
                        <Col lg="3" md="4" sm="6" key={modal.id || index} className="mb-3">
                            <Card className="h-100 shadow-sm border">
                                <div className="position-relative">
                                    <Card.Img
                                        variant="top"
                                        src={modal.image_exc || modal.image || '/placeholder-image.jpg'}
                                        style={{ height: '150px', objectFit: 'cover' }}
                                        alt="Modal preview"
                                    />
                                    <div
                                        className="position-absolute top-0 end-0 p-2"
                                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '0 0 0 8px' }}
                                    >
                                        <CustomTooltip text={modal.status === 1 ? 'Disable Modal' : 'Enable Modal'}>
                                            <Form.Check
                                                type="switch"
                                                id={`status-switch-${modal.id}`}
                                                checked={modal.status === 1}
                                                onChange={() => handleStatusToggle(modal.id, modal.status)}
                                                className="m-0"
                                                style={{
                                                    filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))'
                                                }}
                                            />
                                        </CustomTooltip>
                                    </div>
                                </div>
                                <Card.Body className="p-2 d-flex flex-column">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <small className="text-muted">
                                            Status:
                                            <span className={`ms-1 ${modal.status === 1 ? 'text-success' : 'text-danger'}`}>
                                                {modal.status === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </small>
                                        <small className="text-muted">
                                            {modal.created_at ? new Date(modal.created_at).toLocaleDateString('en-GB') : 'N/A'}
                                        </small>
                                    </div>
                                    <div className="d-flex gap-4 justify-content-start">
                                        {(modal.url_exc || modal.url) && (
                                            <div className="mb-2">
                                                <small className="text-truncate d-block" title={modal.url_exc || modal.url}>
                                                    <Monitor size={12} /> <LinkIcon color={PRIMARY} size={12} /> {modal.url}
                                                </small>
                                            </div>
                                        )}
                                        {/* //small url */}
                                        {(modal.url_sm || modal.sm_url) && (
                                            <div className="mb-2">
                                                <small className="text-truncate d-block" title={modal.url_sm || modal.sm_url}>
                                                    <Smartphone size={16} /> <LinkIcon color={PRIMARY} size={12} /> {modal.url_sm}
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                    <div className="d-flex gap-2 justify-content-end">
                                        <CustomTooltip text="Edit Modal">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="px-2"
                                                onClick={() => handleEditModal(modal)}
                                            >
                                                <Edit2 size={14} />
                                            </Button>
                                        </CustomTooltip>

                                        <CustomTooltip text="Preview Modal">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                className="px-2"
                                                onClick={() => handlePreviewModal(modal)}
                                            >
                                                <Eye size={14} />
                                            </Button>
                                        </CustomTooltip>

                                        <CustomTooltip text="Delete Modal">
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="px-2"
                                                onClick={() => handleDeleteModal(modal.id)}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </CustomTooltip>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                    <Col sm="3" className="mb-4">
                        <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                border: '2px dashed var(--bs-primary)',
                                borderRadius: '15px',
                                padding: '40px',
                                cursor: 'pointer',
                                backgroundColor: '#f8f9fa',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => setShowModal(true)}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#e9ecef'
                                e.target.style.borderColor = '#0056b3'
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa'
                                e.target.style.borderColor = 'var(--bs-primary)'
                            }}
                        >
                            <div className="text-center">
                                <div style={{ fontSize: '48px', color: 'var(--bs-primary)', marginBottom: '10px' }}>+</div>
                                <span style={{ fontSize: '16px', color: '#6c757d' }}>Add New Modal</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Col>

            <Modal show={showModal} onHide={handleModalClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingModalId ? 'Edit Modal' : 'Add New Modal'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Col md="7">
                                <Row>
                                    <Col sm="12" className="mb-3">
                                        <Form.Label><Monitor color={PRIMARY} size={16} className='me-2' />  Modal Image <span className="text-muted">(600x300 px)</span></Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={(e) => handleImageChange(e, 'image', 'big')}
                                            required
                                            accept="image/*"
                                            isInvalid={!!errors.image}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid Modal Image.
                                        </Form.Control.Feedback>
                                        {errors.image && <small className="text-danger">{errors.image}</small>}
                                    </Col>
                                    <Col sm="12" className="mb-3">
                                        <Form.Label><Smartphone color={PRIMARY} size={16} className='me-2' /> Mobile Modal Image <span className="text-muted">(300x400 px)</span></Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={(e) => handleImageChange(e, 'smImage', 'small')}
                                            required
                                            accept="image/*"
                                            isInvalid={!!errors.smImage}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid Mobile Modal Image.
                                        </Form.Control.Feedback>
                                        {errors.smImage && <small className="text-danger">{errors.smImage}</small>}
                                    </Col>
                                    <Col sm="12" className="mb-3">
                                        <Form.Label>URL</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={modalData.url}
                                            onChange={(e) => setModalData(prev => ({ ...prev, url: e.target.value }))}
                                            placeholder="Enter URL (optional)"
                                        />
                                    </Col>
                                    <Col sm="12" className="mb-3">
                                        <Form.Label>Mobile Modal URL</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={modalData.smUrl}
                                            onChange={(e) => setModalData(prev => ({ ...prev, smUrl: e.target.value }))}
                                            placeholder="Enter Mobile Modal URL (optional)"
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col md="5">
                                <div className="ps-3">
                                    <h6 className="mb-3 text-muted">Image Previews</h6>
                                    {previewUrl.big && (
                                        <div className="mb-4">
                                            <small className="text-muted d-block mb-2">Modal Image Preview</small>
                                            <div className="border rounded p-2" style={{ backgroundColor: '#f8f9fa' }}>
                                                <img
                                                    src={previewUrl.big}
                                                    alt="Modal Preview"
                                                    className="img-fluid rounded"
                                                    style={{ maxWidth: '100%', height: 'auto' }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {previewUrl.small && (
                                        <div className="mb-3">
                                            <small className="text-muted d-block mb-2">Mobile Modal Image Preview</small>
                                            <div className="border rounded p-2" style={{ backgroundColor: '#f8f9fa' }}>
                                                <img
                                                    src={previewUrl.small}
                                                    alt="Mobile Modal Preview"
                                                    className="img-fluid rounded"
                                                    style={{ maxWidth: '100%', height: 'auto' }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {!previewUrl.big && !previewUrl.small && (
                                        <div className="text-center py-4">
                                            <div className="text-muted">
                                                <i className="fas fa-image mb-2" style={{ fontSize: '2rem', opacity: 0.3 }}></i>
                                                <p className="mb-0">No images selected</p>
                                                <small>Upload images to see previews here</small>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                Saving...
                            </>
                        ) : (
                            'Save Modal'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            <ImageCropper
                show={showImageCropper}
                onHide={() => setShowImageCropper(false)}
                imageSrc={cropperImageSrc}
                onCropComplete={handleCropComplete}
                targetDimensions={imageDimensions[cropperPreviewType]}
                widthRange={{
                    min: imageDimensions[cropperPreviewType]?.width || 300,
                    max: 1200
                }}
                heightRange={{
                    min: imageDimensions[cropperPreviewType]?.height || 300,
                    max: 800
                }}
                allowFreeform={false}
                showCircularPreview={false}
            />

            {/* Preview Modal */}
            <CustomImagePreview
                showPreviewModal={showPreviewModal}
                setShowPreviewModal={setShowPreviewModal}
                link={isMobile ? (previewModalData?.sm_url || previewModalData?.url_sm) :  (previewModalData?.url || previewModalData?.url_exc)}
                src={isMobile ? (previewModalData?.sm_image || previewModalData?.image_sm) : (previewModalData?.image || previewModalData?.image_exc)}
            />
        </>
    )
}

export default WelcomeModal

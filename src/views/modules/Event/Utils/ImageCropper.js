import React, { useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropper = (props) => {
  const { 
    show, 
    onHide, 
    imageSrc, 
    onCropComplete, 
    targetDimensions = { width: 600, height: 300 },
    widthRange = { min: 150, max: 1200 },
    heightRange = { min: 150, max: 800 },
    allowFreeform = false,
    showCircularPreview = false
  } = props;
  
  const aspectRatio = allowFreeform ? undefined : targetDimensions.width / targetDimensions.height;

  const [crop, setCrop] = useState({
    unit: 'px',
    width: targetDimensions.width,
    height: targetDimensions.height,
    x: 0,
    y: 0,
    aspect: aspectRatio,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const circularCanvasRef = useRef(null);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;

    // Calculate initial crop size based on target dimensions and image size
    const imageAspectRatio = width / height;
    const targetAspectRatio = targetDimensions.width / targetDimensions.height;
    
    let cropWidth, cropHeight;
    
    if (!allowFreeform) {
      // For fixed aspect ratio, calculate the largest possible crop that fits
      if (imageAspectRatio > targetAspectRatio) {
        // Image is wider than target ratio
        cropHeight = Math.min(height, targetDimensions.height);
        cropWidth = cropHeight * targetAspectRatio;
      } else {
        // Image is taller than target ratio or same ratio
        cropWidth = Math.min(width, targetDimensions.width);
        cropHeight = cropWidth / targetAspectRatio;
      }
    } else {
      // For freeform, use target dimensions but scale down if image is smaller
      cropWidth = Math.min(width, targetDimensions.width);
      cropHeight = Math.min(height, targetDimensions.height);
    }

    const initialCrop = {
      unit: 'px',
      width: cropWidth,
      height: cropHeight,
      x: (width - cropWidth) / 2,
      y: (height - cropHeight) / 2,
      aspect: aspectRatio,
    };

    setCrop(initialCrop);
    
    // Trigger crop completion for initial crop to enable preview and button
    setTimeout(() => {
      handleCropComplete(initialCrop);
    }, 100);
  };

  const handleCropChange = (newCrop) => {
    // Apply width and height constraints
    if (newCrop.width < widthRange.min) {
      newCrop.width = widthRange.min;
    }
    if (newCrop.width > widthRange.max) {
      newCrop.width = widthRange.max;
    }
    if (newCrop.height < heightRange.min) {
      newCrop.height = heightRange.min;
    }
    if (newCrop.height > heightRange.max) {
      newCrop.height = heightRange.max;
    }
    
    setCrop(newCrop);
  };

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
    generatePreview(crop);
  };

  const generatePreview = (crop) => {
    if (!crop || !imgRef.current || !previewCanvasRef.current) return;

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas to target dimensions
    canvas.width = targetDimensions.width;
    canvas.height = targetDimensions.height;

    // Clear canvas
    ctx.clearRect(0, 0, targetDimensions.width, targetDimensions.height);

    // Draw the cropped portion scaled to target dimensions
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      targetDimensions.width,
      targetDimensions.height
    );

    // Generate circular preview if requested
    if (showCircularPreview && circularCanvasRef.current) {
      generateCircularPreview(canvas);
    }
  };

  const generateCircularPreview = (sourceCanvas) => {
    if (!circularCanvasRef.current) return;

    const circularCanvas = circularCanvasRef.current;
    const ctx = circularCanvas.getContext('2d');
    const size = Math.min(targetDimensions.width, targetDimensions.height);

    circularCanvas.width = size;
    circularCanvas.height = size;

    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();

    // Draw the cropped image
    ctx.drawImage(sourceCanvas, 0, 0, size, size);
  };

  const handleSave = () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = previewCanvasRef.current;
    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], 'cropped-image.jpg', {
          type: 'image/jpeg',
        });
        onCropComplete(croppedFile);
        onHide();
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Crop Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <div className="mb-3">
            <small className="text-muted">
              Crop your image to {targetDimensions.width}x{targetDimensions.height} pixels
              {!allowFreeform && (
                <span className="d-block">
                  Range: {widthRange.min}-{widthRange.max}px width, {heightRange.min}-{heightRange.max}px height
                </span>
              )}
            </small>
          </div>

          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={handleCropChange}
              onComplete={handleCropComplete}
              aspect={aspectRatio}
              minWidth={widthRange.min}
              maxWidth={widthRange.max}
              minHeight={heightRange.min}
              maxHeight={heightRange.max}
              keepSelection
            >
              <img
                ref={imgRef}
                src={imageSrc}
                onLoad={onImageLoad}
                alt="Crop preview"
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            </ReactCrop>
          )}

          {completedCrop && (
            <div className="mt-3">
              <h6>Preview:</h6>
              <div className="d-flex justify-content-center gap-4 align-items-center">
                {/* Square Preview */}
                <div className="text-center">
                  <p className="mb-2 fw-bold">Square</p>
                  <canvas
                    ref={previewCanvasRef}
                    style={{
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      maxWidth: '200px',
                      maxHeight: '150px',
                    }}
                  />
                  <div className="mt-2">
                    <small className="text-muted">
                      Final size: {targetDimensions.width}px × {targetDimensions.height}px
                    </small>
                  </div>
                </div>

                {/* Circular Preview - Only show if enabled */}
                {showCircularPreview && (
                  <div className="text-center">
                    <p className="mb-2 fw-bold">Circular</p>
                    <div
                      style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        border: '1px solid #ccc',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f8f9fa',
                      }}
                    >
                      <canvas
                        ref={circularCanvasRef}
                        style={{
                          width: '150px',
                          height: '150px',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!completedCrop}
        >
          Save Cropped Image
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageCropper;
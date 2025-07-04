import React, { useState, useRef, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Cropper from 'react-easy-crop';

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

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropShape, setCropShape] = useState('rect'); // 'rect' or 'round'
  const previewCanvasRef = useRef(null);
  const circularCanvasRef = useRef(null);

  const generateCircularPreview = useCallback((sourceCanvas) => {
    if (!circularCanvasRef.current) return;

    const circularCanvas = circularCanvasRef.current;
    const ctx = circularCanvas.getContext('2d');
    const size = Math.min(targetDimensions.width, targetDimensions.height);

    circularCanvas.width = size;
    circularCanvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Save the context state
    ctx.save();

    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();

    // Draw the cropped image
    ctx.drawImage(sourceCanvas, 0, 0, size, size);

    // Restore the context state
    ctx.restore();
  }, [targetDimensions]);

  const generatePreview = useCallback((cropData) => {
    if (!cropData || !imageSrc || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();

    image.onload = () => {
      // Set canvas to target dimensions
      canvas.width = targetDimensions.width;
      canvas.height = targetDimensions.height;

      // Clear canvas with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetDimensions.width, targetDimensions.height);

      // Draw the cropped portion scaled to target dimensions
      ctx.drawImage(
        image,
        cropData.x,
        cropData.y,
        cropData.width,
        cropData.height,
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

    image.crossOrigin = 'anonymous';
    image.src = imageSrc;
  }, [imageSrc, targetDimensions, showCircularPreview, generateCircularPreview]);


  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    generatePreview(croppedAreaPixels);
  }, [generatePreview]);

  const getCroppedImg = useCallback(async (imageSrc, pixelCrop) => {
    const image = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    return new Promise((resolve) => {
      image.onload = () => {
        // Set canvas to target dimensions
        canvas.width = targetDimensions.width;
        canvas.height = targetDimensions.height;

        // Clear canvas with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetDimensions.width, targetDimensions.height);

        // Draw the cropped portion to fill the entire canvas
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          targetDimensions.width,
          targetDimensions.height
        );

        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.9);
      };
      image.src = imageSrc;
    });
  }, [targetDimensions]);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImageBlob) {
        const croppedFile = new File([croppedImageBlob], 'cropped-image.jpg', {
          type: 'image/jpeg',
        });
        onCropComplete(croppedFile);
        onHide();
      }
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
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
            <div style={{ position: 'relative', width: '100%', height: '400px' }}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropCompleteHandler}
                onZoomChange={setZoom}
                cropShape={cropShape}
                showGrid={true}
              />
            </div>
          )}

          {croppedAreaPixels && (
            <div className="mt-3">
              <h6>Preview:</h6>
              <div className="d-flex justify-content-center gap-4 align-items-center">
                {/* Square Preview */}
                <div className="text-center">
                  <div
                    onClick={() => setCropShape('rect')}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <p className="mb-2 fw-bold text-primary">Rectangle</p>
                    <canvas
                      className={`${cropShape === 'rect' ? 'shadow-xl' : ''}`}
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
                </div>

                {/* Circular Preview - Only show if enabled */}
                {showCircularPreview && (
                  <div className="text-center">
                    <div
                      onClick={() => setCropShape('round')}
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <p className="mb-2 fw-bold text-primary">Circular</p>
                      <div
                        className={`${cropShape === 'round' ? 'shadow-xl' : ''}`}
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
          disabled={!croppedAreaPixels}
        >
          Save Cropped Image
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageCropper;
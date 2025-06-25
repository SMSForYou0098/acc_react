import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric-pure-browser';
import { Button, Spinner } from 'react-bootstrap';
import { ArrowBigDownDash, Printer } from 'lucide-react';
import QRCode from 'qrcode';

const IdCardCanvas = ({ finalImage, orderId, userData }) => {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (finalImage) {
      setImageUrl(finalImage);
    }
  }, [finalImage]);

  const loadBackgroundImage = (url) => {
    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(url, (img) => {
        if (img) {
          resolve(img);
        } else {
          reject(new Error('Failed to load image'));
        }
      }, { crossOrigin: 'anonymous' });
    });
  };

  const addText = (text, options, canvas) => {
    const textObj = new fabric.Text(text, {
      fontSize: options.fontSize || 16,
      fontFamily: options.fontFamily || 'Arial',
      fill: options.fill || '#000',
      ...options,
      selectable: false,
      evented: false
    });
    canvas.add(textObj);
    return textObj;
  };

  const loadImage = (url, options = {}, canvas) => {
    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(
        url,
        (img) => {
          if (!img) {
            reject(new Error('Failed to load image'));
            return;
          }
          
          if (options.width && options.height) {
            const scaleX = options.width / img.width;
            const scaleY = options.height / img.height;
            img.scaleX = scaleX;
            img.scaleY = scaleY;
          }
          
          img.set({
            left: options.left || 0,
            top: options.top || 0,
            selectable: false,
            evented: false,
            ...options
          });
          resolve(img);
        },
        { crossOrigin: 'anonymous' }
      );
    });
  };

  useEffect(() => {
    if (!imageUrl || !userData) return;

    const canvas = new fabric.Canvas(canvasRef.current);
    setCanvasReady(false);

    const showLoadingIndicator = (canvas) => {
      const loaderText = new fabric.Text('Generating ID Card...', {
        left: canvas.width / 2,
        top: canvas.height / 2,
        fontSize: 20,
        fill: '#555',
        fontFamily: 'Arial',
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
      });
      canvas.add(loaderText);
      canvas.renderAll();
      return loaderText;
    };

    const drawCanvas = async () => {
      const loader = showLoadingIndicator(canvas);
      try {
        const bgImg = await loadBackgroundImage(imageUrl);
        const imgWidth = bgImg.width;
        const imgHeight = bgImg.height;

        // Set canvas dimensions to match background image
        canvas.setDimensions({ width: imgWidth, height: imgHeight });
        bgImg.scaleToWidth(imgWidth);
        bgImg.scaleToHeight(imgHeight);
        canvas.setBackgroundImage(bgImg, canvas.renderAll.bind(canvas), {
          crossOrigin: 'anonymous',
        });

        canvas.remove(loader);

        // Load user photo if available
        const photoUrl = userData.photo_id || userData.photo;
        if (photoUrl) {
          try {
            const photoWidth = imgWidth * 0.3; // 30% of canvas width
            const photoHeight = photoWidth * 1.2; // Maintain aspect ratio
            const photo = await loadImage(photoUrl, { 
              left: imgWidth / 2,
              top: imgHeight * 0.2,
              width: photoWidth,
              height: photoHeight,
              originX: 'center',
              originY: 'center'
            }, canvas);
            canvas.add(photo);
          } catch (err) {
            console.error('Failed to load user photo:', err);
            addText('Photo not available', { 
              left: imgWidth / 2,
              top: imgHeight * 0.25,
              fontSize: 14,
              originX: 'center',
              originY: 'center'
            }, canvas);
          }
        }

        // Add user details (positioned relative to canvas size)
        const labelLeft = imgWidth * 0.1;  // starting X position for labels
const valueLeft = imgWidth * 0.35; // starting X for values
const lineHeight = imgHeight * 0.05; // vertical spacing
let currentTop = imgHeight * 0.35; // initial Y position

// Name
addText('Name:', {
  left: labelLeft,
  top: currentTop,
  fontSize: imgHeight * 0.035,
  originX: 'left',
  fontWeight: 'bold',
}, canvas);
addText(userData.name || '-', {
  left: valueLeft,
  top: currentTop,
  fontSize: imgHeight * 0.035,
  originX: 'left',
}, canvas);

// Email
currentTop += lineHeight;
addText('Email:', {
  left: labelLeft,
  top: currentTop,
  fontSize: imgHeight * 0.035,
  originX: 'left',
  fontWeight: 'bold',
}, canvas);
addText(userData.email || '-', {
  left: valueLeft,
  top: currentTop,
  fontSize: imgHeight * 0.035,
  originX: 'left',
}, canvas);

// Company
currentTop += lineHeight;
addText('Company:', {
  left: labelLeft,
  top: currentTop,
  fontSize: imgHeight * 0.035,
  originX: 'left',
  fontWeight: 'bold',
}, canvas);
addText(userData.company_name || '-', {
  left: valueLeft,
  top: currentTop,
  fontSize: imgHeight * 0.035,
  originX: 'left',
}, canvas);

// Designation
currentTop += lineHeight;
addText('Designation:', {
  left: labelLeft,
  top: currentTop,
  fontSize: imgHeight * 0.035,
  originX: 'left',
  fontWeight: 'bold',
}, canvas);
addText(userData.designation || '-', {
  left: valueLeft,
  top: currentTop,
  fontSize: imgHeight * 0.035,
  originX: 'left',
}, canvas);


        // Add QR code if orderId is available
        if (orderId) {
          try {
            const qrDataURL = await QRCode.toDataURL(orderId);
            const qrSize = imgWidth * 0.3; // 30% of canvas width
            const qrImg = await loadImage(qrDataURL, { 
              left: imgWidth / 1.87,
              top: imgHeight * 0.78,
              width: qrSize,
              height: qrSize,
              originX: 'center',
              originY: 'center'
            }, canvas);
            canvas.add(qrImg);
          } catch (err) {
            console.error('Failed to generate QR code:', err);
          }
        }

        canvas.renderAll();
        setCanvasReady(true);
      } catch (err) {
        console.error('Canvas draw error:', err);
        canvas.remove(loader);
        addText('Error loading ID card', { 
          left: canvas.width / 2,
          top: canvas.height / 2,
          fontSize: 18,
          fill: 'red',
          originX: 'center',
          originY: 'center'
        }, canvas);
        canvas.renderAll();
      }
    };

    drawCanvas();
    
    return () => {
      canvas.dispose();
    };
  }, [imageUrl, userData, orderId]);

  const downloadCanvas = () => {
    setLoading(true);
    try {
      const canvasEl = canvasRef.current;
      const dataURL = canvasEl.toDataURL('image/jpeg', 0.9);
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `id_card_${orderId || 'id'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const printCanvas = () => {
    setLoading(true);
    try {
      const canvasEl = canvasRef.current;
      const dataURL = canvasEl.toDataURL('image/png');
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print ID Card</title>
            <style>
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
              img { max-width: 100%; max-height: 100vh; }
            </style>
          </head>
          <body>
            <img src="${dataURL}" onload="window.print();" />
          </body>
        </html>
      `);
      printWindow.document.close();
      
      printWindow.onload = () => {
        printWindow.print();
      };
    } catch (err) {
      console.error('Print failed:', err);
      alert('Print failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex gap-2 mb-3">
        <Button
          variant="primary"
          className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
          onClick={downloadCanvas}
          disabled={!canvasReady || loading}
        >
          {loading ? 'Please Wait...' : 'Download'}
          <ArrowBigDownDash size={18} />
        </Button>
        <Button
          variant="secondary"
          className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
          onClick={printCanvas}
          disabled={!canvasReady || loading}
        >
          Print
          <Printer size={18} />
        </Button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
        {imageUrl && userData ? (
          <canvas 
            ref={canvasRef} 
            style={{ 
              border: '1px solid #ddd',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
        ) : (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" />
            <p className="mt-2">Loading ID Card...</p>
          </div>
        )}
      </div>
    </>
  );
};

export default IdCardCanvas;
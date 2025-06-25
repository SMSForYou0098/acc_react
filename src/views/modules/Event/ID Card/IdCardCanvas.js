import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric-pure-browser';
import { Button, Spinner } from 'react-bootstrap';
import { ArrowBigDownDash, Printer } from 'lucide-react';
import QRCode from 'qrcode';

const IdCardCanvas = ({ finalImage, orderId, userData }) => {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  const WIDTH = 400;
  const HEIGHT = 600;

  useEffect(() => {
    if (!finalImage || !userData) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: WIDTH,
      height: HEIGHT
    });
    setCanvasReady(false);

    const loadImage = (url, options = {}) => {
      return new Promise((resolve, reject) => {
        fabric.Image.fromURL(
          url,
          (img) => {
            if (!img) {
              reject(new Error('Failed to load image'));
              return;
            }
            
            // Apply scaling if width/height is provided
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

    const addText = (text, options) => {
      const textObj = new fabric.Text(text, {
        fontSize: options.fontSize || 16,
        fontFamily: 'Arial',
        fill: '#000',
        ...options,
        selectable: false,
        evented: false
      });
      canvas.add(textObj);
      return textObj;
    };

    const draw = async () => {
      try {
        // Clear canvas first
        canvas.clear();
        
        // Load background image
        const bg = await loadImage(finalImage, { 
          width: WIDTH, 
          height: HEIGHT 
        });
        canvas.setBackgroundImage(bg, canvas.renderAll.bind(canvas));

        // Load user photo if available
        const photoUrl = userData.photo_id || userData.photo;
        if (photoUrl) {
          try {
            const photo = await loadImage(photoUrl, { 
              left: 150, 
              top: 80, 
              width: 100, 
              height: 120 
            });
            canvas.add(photo);
          } catch (err) {
            console.error('Failed to load user photo:', err);
            addText('Photo not available', { 
              left: 150, 
              top: 130, 
              fontSize: 14 
            });
          }
        }

        // Add user details
        addText(`Name: ${userData.name || '-'}`, { left: 50, top: 220, fontSize: 14 });
        addText(`Email: ${userData.email || '-'}`, { left: 50, top: 250, fontSize: 14 });
        addText(`Contact: ${userData.contact || userData.number || '-'}`, { left: 50, top: 280, fontSize: 14 });
        addText(`Company: ${userData.user_company_name || '-'}`, { left: 50, top: 310, fontSize: 14 });

        // Add QR code if orderId is available
        if (orderId) {
          try {
            const qrDataURL = await QRCode.toDataURL(orderId);
            const qrImg = await loadImage(qrDataURL, { 
              left: 140, 
              top: 360, 
              width: 120, 
              height: 120 
            });
            canvas.add(qrImg);
          } catch (err) {
            console.error('Failed to generate QR code:', err);
          }
        }

        canvas.renderAll();
        setCanvasReady(true);
      } catch (err) {
        console.error('Canvas draw error:', err);
        // Add error message to canvas
        addText('Error loading ID card', { 
          left: 50, 
          top: 50, 
          fontSize: 18, 
          fill: 'red' 
        });
        canvas.renderAll();
      }
    };

    draw();
    
    return () => {
      canvas.dispose();
    };
  }, [finalImage, userData, orderId]);

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
      
      // Fallback in case onload doesn't work
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
        {finalImage && userData ? (
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


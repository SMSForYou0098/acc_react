import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric-pure-browser';
import { Button, Spinner } from 'react-bootstrap';
import { ArrowBigDownDash, Printer } from 'lucide-react';
import { capitalize } from 'lodash';
import { QRCodeCanvas } from 'qrcode.react';
const IdCardCanvas = ({ finalImage, orderId, userData, userImage, showDetails = true,bgRequired }) => {
  const canvasRef = useRef(null);
  const qrCodeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);


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


  useEffect(() => {
    if (!finalImage || !userData) return;

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
      if (finalImage) {
        try {
          canvas.remove(loader);
          
          // First, get dimensions from the background image
          const bgImg = await new Promise((resolve) => {
            fabric.Image.fromURL(finalImage, (img) => {
              if (!img) return;

              const displayWidth = 400;
              const scaleFactor = displayWidth / img.width;
              const displayHeight = img.height * scaleFactor;

              canvas.setDimensions({ width: displayWidth, height: displayHeight });
              
              if (bgRequired) {
                img.scaleX = scaleFactor;
                img.scaleY = scaleFactor;
                img.selectable = false;
                img.evented = false;
                resolve(img);
              } else {
                // Set white background with same dimensions
                canvas.backgroundColor = 'white';
                resolve(null);
              }
            }, { crossOrigin: 'anonymous' });
          });

          if (bgRequired && bgImg) {
            canvas.setBackgroundImage(bgImg, canvas.renderAll.bind(canvas));
          } else {
            canvas.renderAll();
          }


          // Load user photo if available
          const profileImage = userImage;
          if (profileImage) {
            const profileImageURL = profileImage;
            const circleCenterX = 200;
            const circleCenterY = 235;
            const circleRadius = 70;

            fabric.Image.fromURL(profileImageURL, (img) => {
              if (img) {
                const baseSize = Math.max(img.width, img.height);
                const scale = (circleRadius * 2.5 * 1.05) / baseSize; // Slight zoom to remove white edge

                img.set({
                  left: circleCenterX,
                  top: circleCenterY,
                  originX: 'center', // 🔑
                  originY: 'center', // 🔑
                  scaleX: scale,
                  scaleY: scale,
                  selectable: false,
                  evented: false,
                  clipPath: new fabric.Circle({
                    radius: circleRadius,
                    originX: 'center',
                    originY: 'center',
                    left: circleCenterX,
                    top: circleCenterY,
                    absolutePositioned: true,
                  }),
                });

                canvas.add(img);
                canvas.renderAll();
              }
            }, { crossOrigin: 'anonymous' });



          }




          if (showDetails) {
            const values = [
              capitalize(userData?.name) || 'User Name',
              capitalize(userData?.designation) || 'User Designation',
              capitalize(userData?.company_name) || 'Campany Name',

            ];
            const fontSize = 26;
            const fontFamily = 'Arial';
            const valueLeft = 120; // <-- Adjust this to match where values should start
            const startTop = 330;  // <-- Adjust this to match the first value's Y position
            const verticalGap = 35; // <-- Adjust this to match the gap between lines

            values.forEach((value, i) => {
              const valueText = new fabric.Text(value, {
                left: valueLeft,
                top: startTop + i * verticalGap,
                fontSize,
                fontFamily,
                fill: '#076066', // Change text color to white
                fontWeight: 'bold', // Make text bold
                selectable: false,
                evented: false,
                originX: 'left'
              });
              canvas.add(valueText);
            });
            canvas.renderAll();
          }

          // Always show QR code
          const qrCodeCanvas = qrCodeRef.current;
          if (qrCodeCanvas) {
            const qrCodeDataURL = qrCodeCanvas.toDataURL('image/png');
            fabric.Image.fromURL(qrCodeDataURL, (qrImg) => {
              const qrCodeWidth = 105;
              const qrCodeHeight = 105;
              const padding = 5;
              const qrPositionX = 147;
              const qrPositionY = 464;

              const qrBackground = new fabric.Rect({
                left: qrPositionX - padding,
                top: qrPositionY - padding,
                width: qrCodeWidth + padding * 2,
                height: qrCodeHeight + padding * 2,
                fill: 'white',
                rx: 12, // rounded corners
                ry: 12,
                selectable: false,
                evented: false,
              });


              qrImg.set({
                left: qrPositionX,
                top: qrPositionY,
                selectable: false,
                evented: false,
                scaleX: qrCodeWidth / qrImg?.width,
                scaleY: qrCodeHeight / qrImg?.height,
              });

              canvas.add(qrBackground, qrImg);
              canvas.renderAll();
            });
          }
          setCanvasReady(true);
        } catch (err) {
          console.error('Canvas draw error:', err);
          canvas.remove(loader);
          canvas.renderAll();
        }
      }
    };

    drawCanvas();

    return () => {
      canvas.dispose();
    };
  }, [finalImage, userData, orderId]);

  const downloadCanvas = () => {
    setLoading(true);
    try {
      const canvasEl = canvasRef.current;
      
      // Get the fabric canvas instance for higher quality export
      const fabricCanvas = canvasEl.fabric || canvasEl.__fabric;
      
      let dataURL;
      if (fabricCanvas) {
        // Use fabric's built-in export with higher quality
        dataURL = fabricCanvas.toDataURL({
          format: 'png', // PNG for lossless quality
          quality: 1.0,  // Maximum quality
          multiplier: 4  // 2x resolution for crisp output
        });
      } else {
        // Fallback to native canvas with PNG
        dataURL = canvasEl.toDataURL('image/png');
      }
      
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `id_card_${orderId || 'id'}.png`; // Changed to PNG
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
      <div className="d-flex gap-2 mb-3 w-50 justify-content-center">
        <Button
          variant="primary"
          className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
          onClick={downloadCanvas}
          disabled={!canvasReady || loading}
        >
          {loading ? "Please Wait..." : "Download"}
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

      <div
        style={{ display: "flex", justifyContent: "center", overflow: "auto" }}
      >
        {finalImage && userData ? (
          <div
            style={{
              border: "1px solid #ddd",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              display: "inline-block", // Ensures proper sizing
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                display: "block", // Removes default inline spacing
              }}
            />
          </div>
        ) : (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" />
            <p className="mt-2">Loading ID Card...</p>
          </div>
        )}
      </div>
      <div style={{ display: "none" }}>
        <QRCodeCanvas ref={qrCodeRef} value={orderId} size={150} />
      </div>
    </>
  );
};

export default IdCardCanvas;
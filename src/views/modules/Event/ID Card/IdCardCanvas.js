import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric-pure-browser';
import { Button, Spinner } from 'react-bootstrap';
import { ArrowBigDownDash, Printer } from 'lucide-react';
import { capitalize } from 'lodash';
import { QRCodeCanvas } from 'qrcode.react';
import { useMyContext } from '../../../../Context/MyContextProvider';
import { CreateHDCanvas, HandlePrint, UploadToAPIBackground } from './utils/CanvasUtils';
const IdCardCanvas = (props) => {
  const { finalImage, userData, orderId, bgRequired, showDetails = true, userImage, zones,hidePrint = false } = props;
  const { api, authToken, ErrorAlert } = useMyContext();
  const canvasRef = useRef(null);
  const qrCodeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

useEffect(() => {
    if (!finalImage || !userData) return;
}, [finalImage, userData]);

  useEffect(() => {
    if (!finalImage || !userData) return;

    const canvas = new fabric.Canvas(canvasRef.current);
    setCanvasReady(false);

    const showLoadingIndicator = (canvas) => {
      const loaderText = new fabric.Text('Generating ID Card...', {
        left: canvas?.width / 2,
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
              if (!img) {
                resolve(null);
                return;
              }

              const displayWidth = 400;
              const scaleFactor = displayWidth / img?.width;
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
                const baseSize = Math.max(img?.width, img.height);
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
              capitalize(userData?.company_name || userData?.comp_name || userData?.company?.company_name)  || 'Campany Name',
            ];
            const fontSize = 18;
            const fontFamily = 'Arial';
            const valueLeft = canvas?.width / 2; // <-- Adjust this to match where values should start
            const startTop = 320;  // <-- Adjust this to match the first value's Y position
            const verticalGap = 25; // <-- Adjust this to match the gap between lines

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
                originX: 'center'
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
              const qrCodeWidth = 90;
              const qrCodeHeight = 90;
              const padding = 5;
              const qrPositionX = 155;
              const qrPositionY = 410;

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

          const boxWidth = 28;
          const boxHeight = 28;
          const boxPadding = 8;
          const numBoxes = zones?.length ?? 0;
          const totalBoxesWidth = numBoxes * boxWidth + (numBoxes - 1) * boxPadding;
          const boxStartX = (canvas?.width - totalBoxesWidth) / 2; // Center horizontally
          const boxStartY = 530;
          const borderRadius = 8; // Add border radius
          const userZones = userData?.company?.zone ?
            (Array.isArray(userData.company.zone) ?
              userData.company.zone :
              JSON.parse(userData.company.zone)) : []; // Indices of boxes that should have check icons
          for (let i = 0; i < numBoxes; i++) {
            const currentZone = zones[i];
            const isUserZone = userZones.includes(currentZone?.id || currentZone);
            const box = new fabric.Rect({
              left: boxStartX + i * (boxWidth + boxPadding),
              top: boxStartY,
              width: boxWidth,
              height: boxHeight,
              fill: isUserZone ? '#076066' : '#f0f0f0', // Different colors for checked/unchecked
              rx: borderRadius, // Add horizontal border radius
              ry: borderRadius, // Add vertical border radius
              stroke: '#076066', // Add border
              strokeWidth: 2,
              selectable: false,
              evented: false,
            });
            canvas.add(box);

            // Add check icon for selected boxes
            if (isUserZone) {
              const checkIcon = new fabric.Text('✓', {
                left: boxStartX + i * (boxWidth + boxPadding) + boxWidth / 2,
                top: boxStartY + boxHeight / 2,
                fontSize: 16,
                fill: 'white',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                originX: 'center',
                originY: 'center',
                selectable: false,
                evented: false,
              });
              canvas.add(checkIcon);
            } else {
              // Add zone number (always visible)
              const zoneNumber = new fabric.Text((i + 1).toString(), {
                left: boxStartX + i * (boxWidth + boxPadding) + boxWidth / 2,
                top: boxStartY + boxHeight / 2,
                fontSize: 14,
                fill: isUserZone ? 'white' : '#076066',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                originX: 'center',
                originY: 'center',
                selectable: false,
                evented: false,
              });
              canvas.add(zoneNumber);
            }
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
  }, [finalImage, userData, orderId, bgRequired, showDetails, userImage]);


  // Add this new function to upload file to API in background
  const downloadCanvas = async () => {
      setLoading(true);
      
      try {
        const hdCanvas = await CreateHDCanvas({
          finalImage,
          userImage,
          userData,
          orderId,
          zones,
          bgRequired
        });
       // return  console.log( hdCanvas); // Return the HD canvas for further processing
        hdCanvas.renderAll();
        const dataURL = hdCanvas.toDataURL({ format: 'png', quality: 1.0 });
  
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `id_card_${orderId || 'id'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        const filename = `id_card_${orderId || 'id'}.png`;
        UploadToAPIBackground({
          dataURL,
          filename,
          userId: userData?.id,
          api,
          authToken
        }).then((result) => {
          if (result) {
            // toast.success('ID Card uploaded to server');
          }
        });
  
        hdCanvas.dispose();
      } catch (err) {
        alert('HD Download failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    const printCanvas = async () => {
      setLoading(true);
      try {
        const hdCanvas = await CreateHDCanvas({
          finalImage,
          userImage,
          userData,
          orderId,
          zones,
          bgRequired
        });
  
        await HandlePrint({
          hdCanvas,
          orderId,
          userId: userData.id,
          api,
          authToken,
          ErrorAlert
        });
  
        hdCanvas.dispose();
      } catch (err) {
        console.error('Print process failed:', err);
        alert('Printing failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <div className="d-flex gap-2 mb-3 w-100 justify-content-center">
        <Button
          variant="primary"
          className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
          onClick={downloadCanvas}
          disabled={!canvasReady || loading}
        >
          {loading ? "Please Wait..." : "Download"}
          <ArrowBigDownDash size={18} />
        </Button>
        {!hidePrint && 
        <Button
          variant="secondary"
          className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
          onClick={printCanvas}
          disabled={!canvasReady || loading}
        >
          Print
          <Printer size={18} />
        </Button>
        }
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
              borderRadius: "12px",
              overflow: "hidden",
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
        <QRCodeCanvas ref={qrCodeRef} value={orderId} size={200 * 3} bgColor="transparent"/>
      </div>
    </>
  );
};

export default IdCardCanvas;
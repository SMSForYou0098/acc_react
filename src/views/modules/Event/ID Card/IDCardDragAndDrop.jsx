import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric-pure-browser';
import { Button, Spinner } from 'react-bootstrap';
import { ArrowBigDownDash, Printer, Save } from 'lucide-react';
import QRCode from 'qrcode';
import { capitalize } from 'lodash';
import { QRCodeCanvas } from 'qrcode.react';
import { CreateHDCanvas,  HandlePrint,  UploadToAPIBackground,  } from './utils/Canvas_Utils'
import { useMyContext } from '../../../../Context/MyContextProvider';

const IDCardDragAndDrop = ({ 
  finalImage, 
  orderId, 
  userData, 
  userImage, 
  zones = [], 
  bgRequired = true,
  api,
  isEdit = true,
  isCircle = false
}) => {
  const canvasRef = useRef(null);
  const qrCodeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [elementPositions, setElementPositions] = useState({});
  const [savedLayout, setSavedLayout] = useState();
  const [fetchingLayout, setFetchingLayout] = useState(true);
  const {authToken,ErrorAlert} = useMyContext();
  // Fetch layout from API
  useEffect(() => {
    if (!orderId) {
      setFetchingLayout(false);
      return;
    }

    const fetchLayout = async () => {
      try {
        setFetchingLayout(true);
        const response = await fetch(`/api/layouts/${orderId}`);
        const data = await response.json();
        if (data.success) {
          setSavedLayout(data?.layout);
        }
      } catch (error) {
        console.error('Failed to fetch layout:', error);
      } finally {
        setFetchingLayout(false);
      }
    };

    fetchLayout();
  }, [orderId]);

  const saveLayoutToBackend = async (layoutData) => {
    try {
      setLoading(true);
      console.log('Layout saved:', layoutData);
    } catch (error) {
      console.error('Failed to save layout:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackElementPositions = (canvas) => {
    const positions = {};
    canvas.getObjects().forEach(obj => {
      if (obj.name) {
        positions[obj.name] = {
          left: obj.left,
          top: obj.top,
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
          angle: obj.angle,
          originX: obj.originX,
          originY: obj.originY
        };
      }
    });
    setElementPositions(positions);
    return positions;
  };

  const applySavedLayout = (canvas) => {
    if (!savedLayout) return;
    
    canvas.getObjects().forEach(obj => {
      if (obj.name && savedLayout[obj.name]) {
        const { left, top, scaleX, scaleY, angle, originX, originY } = savedLayout[obj.name];
        obj.set({
          left,
          top,
          scaleX,
          scaleY,
          angle,
          originX,
          originY
        }).setCoords();
      }
    });
    canvas.renderAll();
  };

  useEffect(() => {
  if (!canvasRef.current || !finalImage || !userData || fetchingLayout) return;

  let isMounted = true;
  let canvas;

  const setupEventListeners = (canvasInstance) => {
    canvasInstance.on('object:modified', () => {
      trackElementPositions(canvasInstance);
    });
  };

  const initCanvas = async () => {
    try {
      canvas = new fabric.Canvas(canvasRef.current, {
        selection: isEdit,
        preserveObjectStacking: true
      });

      // Load background image
      const bgImg = await new Promise((resolve) => {
        fabric.Image.fromURL(finalImage, (img) => {
          if (!img || !isMounted) return;
          const displayWidth = 400;
          const scaleFactor = displayWidth / img.width;
          const displayHeight = img.height * scaleFactor;

          canvas.setDimensions({ width: displayWidth, height: displayHeight });
          img.scaleX = scaleFactor;
          img.scaleY = scaleFactor;
          img.selectable = false;
          img.evented = false;
          resolve(img);
        }, { crossOrigin: 'anonymous' });
      });

      if (!isMounted) return;

      if (bgRequired) {
        canvas.setBackgroundImage(bgImg, () => {
          if (canvas.contextContainer) canvas.renderAll();
        });
      } else {
        canvas.setBackgroundColor('white', () => {
          if (canvas.contextContainer) canvas.renderAll();
        });
      }

      // Add user image (circle or rounded square)
      if (userImage) {
        const photo = await new Promise((resolve) => {
          fabric.Image.fromURL(userImage, (img) => {
            if (!img || !isMounted) return;

            const circleCenterX = 200;
            const circleCenterY = 235;
            const circleRadius = 70;
            const boxSize = circleRadius * 2.5 * 1.05;
            const baseSize = Math.max(img.width, img.height);
            const scale = boxSize / baseSize;

            const clipShape = isCircle
              ? new fabric.Circle({
                  radius: circleRadius,
                  originX: 'center',
                  originY: 'center',
                })
              : new fabric.Rect({
                  width: boxSize,
                  height: boxSize,
                  rx: 20,
                  ry: 20,
                  originX: 'center',
                  originY: 'center',
                });

            img.set({
              left: savedLayout?.userPhoto?.left || circleCenterX,
              top: savedLayout?.userPhoto?.top || circleCenterY,
              originX: 'center',
              originY: 'center',
              scaleX: savedLayout?.userPhoto?.scaleX || scale,
              scaleY: savedLayout?.userPhoto?.scaleY || scale,
              selectable: isEdit,
              evented: isEdit,
              hasControls: isEdit,
              hasBorders: isEdit,
              name: 'userPhoto',
              clipPath: clipShape,
            });

            resolve(img);
          }, { crossOrigin: 'anonymous' });
        });

        if (isMounted) {
          canvas.add(photo);
        }
      }

      // Add text elements
      const addTextElement = (text, name, defaultLeft, defaultTop) => {
        const savedPos = savedLayout?.[name];
        return new fabric.Text(text, {
          fontSize: 18,
          fontFamily: 'Arial',
          fill: '#076066',
          fontWeight: 'bold',
          left: savedPos?.left || defaultLeft,
          top: savedPos?.top || defaultTop,
          originX: savedPos?.originX || 'center',
          originY: savedPos?.originY || 'top',
          scaleX: savedPos?.scaleX || 1,
          scaleY: savedPos?.scaleY || 1,
          angle: savedPos?.angle || 0,
          selectable: isEdit,
          evented: isEdit,
          hasControls: isEdit,
          hasBorders: isEdit,
          name: name
        });
      };

      const valueLeft = canvas?.width / 2;
      const startTop = 320;
      const verticalGap = 25;

      const values = [
        capitalize(userData?.name) || 'User Name',
        capitalize(userData?.designation) || 'Designation',
        capitalize(userData?.company_name || userData?.comp_name) || 'Company Name',
      ];

      values.forEach((text, i) => {
        canvas.add(addTextElement(text, `textValue_${i}`, valueLeft, startTop + i * verticalGap));
      });

      // QR Code
      if (orderId) {
        try {
          const qrDataURL = await QRCode.toDataURL(orderId, { margin: 0.5 });
          const qrImg = await new Promise((resolve) => {
            fabric.Image.fromURL(qrDataURL, (img) => {
              if (!img || !isMounted) return;

              const qrCodeWidth = 100;
              const qrCodeHeight = 100;
              const qrPositionX = 155;
              const qrPositionY = 410;

              img.set({
                left: savedLayout?.qrCode?.left || qrPositionX,
                top: savedLayout?.qrCode?.top || qrPositionY,
                scaleX: savedLayout?.qrCode?.scaleX || (qrCodeWidth / img.width),
                scaleY: savedLayout?.qrCode?.scaleY || (qrCodeHeight / img.height),
                originX: 'left',
                originY: 'top',
                selectable: isEdit,
                evented: isEdit,
                hasControls: isEdit,
                hasBorders: isEdit,
                name: 'qrCode'
              });

              resolve(img);
            }, { crossOrigin: 'anonymous' });
          });

          if (isMounted) canvas.add(qrImg);
        } catch (err) {
          console.error('QR Code Error:', err);
        }
      }

      // Zone Boxes
      const boxWidth = 28;
      const boxHeight = 28;
      const boxPadding = 8;
      const numBoxes = zones?.length ?? 0;
      const totalBoxesWidth = numBoxes * boxWidth + (numBoxes - 1) * boxPadding;
      const boxStartX = (canvas?.width - totalBoxesWidth) / 2;
      const boxStartY = 530;
      const borderRadius = 8;

      const userZones = userData?.company?.zone
        ? (Array.isArray(userData.company.zone)
            ? userData.company.zone
            : JSON.parse(userData.company.zone))
        : [];

      for (let i = 0; i < numBoxes; i++) {
        const currentZone = zones[i];
        const isUserZone = userZones.includes(currentZone?.id || currentZone);

        const box = new fabric.Rect({
          left: boxStartX + i * (boxWidth + boxPadding),
          top: boxStartY,
          width: boxWidth,
          height: boxHeight,
          fill: isUserZone ? '#076066' : '#f0f0f0',
          rx: borderRadius,
          ry: borderRadius,
          stroke: '#076066',
          strokeWidth: 2,
          selectable: false,
          evented: false,
          name: `zoneBox_${i}`
        });
        canvas.add(box);

        const label = isUserZone
          ? new fabric.Text('✓', {
              fontSize: 16,
              fill: 'white',
              fontWeight: 'bold',
            })
          : new fabric.Text((i + 1).toString(), {
              fontSize: 14,
              fill: '#076066',
              fontWeight: 'bold',
            });

        label.set({
          left: box.left + boxWidth / 2,
          top: box.top + boxHeight / 2,
          originX: 'center',
          originY: 'center',
          fontFamily: 'Arial',
          selectable: false,
          evented: false,
          name: isUserZone ? `zoneCheck_${i}` : `zoneNumber_${i}`
        });
        canvas.add(label);
      }

      applySavedLayout(canvas);
      setupEventListeners(canvas);
      trackElementPositions(canvas);
      if (isMounted) setCanvasReady(true);
    } catch (err) {
      console.error('Canvas initialization error:', err);
    }
  };

  initCanvas();

  return () => {
    isMounted = false;
    if (canvas) canvas.dispose();
  };
}, [canvasRef.current, finalImage, userData, userImage, orderId, savedLayout, fetchingLayout, zones, bgRequired, isEdit, isCircle]);

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

  if (fetchingLayout) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Loading Layout...</p>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex gap-2 mb-3 justify-content-end">
        {isEdit && (
          <Button
            variant="primary"
            onClick={() => saveLayoutToBackend(elementPositions)}
            disabled={!canvasReady || loading}
            className="d-flex align-items-center gap-2"
          >
            {loading ? 'Saving...' : 'Save Layout'}
            <Save size={16} />
          </Button>
        )}
        <Button
          variant="primary"
          onClick={downloadCanvas}
          disabled={!canvasReady || loading}
          className="d-flex align-items-center gap-2"
        >
          {loading ? 'Please Wait...' : 'Download'}
          <ArrowBigDownDash size={16} />
        </Button>
        <Button
          variant="secondary"
          onClick={printCanvas}
          disabled={!canvasReady || loading}
          className="d-flex align-items-center gap-2"
        >
          Print
          <Printer size={16} />
        </Button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
        {finalImage && userData ? (
          <div
            style={{
              border: "1px solid #ddd",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              display: "inline-block",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <canvas 
              ref={canvasRef} 
              style={{ display: "block" }}
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
        <QRCodeCanvas ref={qrCodeRef} value={orderId} size={150 * 3} />
      </div>
    </>
  );
};

export default IDCardDragAndDrop;
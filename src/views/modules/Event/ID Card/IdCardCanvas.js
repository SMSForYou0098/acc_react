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

    const canvas = new fabric.Canvas(canvasRef.current);
    setCanvasReady(false);

    const loadImage = (url, options = {}) => {
      return new Promise((resolve) => {
        fabric.Image.fromURL(
          url,
          (img) => {
            if (options.width && options.height) {
              img.scaleToWidth(options.width);
              img.scaleToHeight(options.height);
            }
            img.set({
              ...options,
              selectable: false,
              evented: false
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
    };

    const draw = async () => {
      try {
        canvas.setWidth(WIDTH);
        canvas.setHeight(HEIGHT);

        const bg = await loadImage(finalImage, { left: 0, top: 0, width: WIDTH, height: HEIGHT });
        canvas.setBackgroundImage(bg, canvas.renderAll.bind(canvas));

        const photoUrl = userData.photo_id || userData.photo;
        if (photoUrl) {
          const photo = await loadImage(photoUrl, { left: 150, top: 80, width: 100, height: 120 });
          canvas.add(photo);
        }

        addText(userData.name || '-', { left: 50, top: 220, fontSize: 18, fontWeight: 'bold' });
        addText(`Email: ${userData.email || '-'}`, { left: 50, top: 250, fontSize: 14 });
        addText(`Contact: ${userData.contact || userData.number || '-'}`, { left: 50, top: 280, fontSize: 14 });
        addText(`Company: ${userData.user_company_name || '-'}`, { left: 50, top: 310, fontSize: 14 });

        if (orderId) {
          const qrDataURL = await QRCode.toDataURL(orderId);
          const qrImg = await loadImage(qrDataURL, { left: 140, top: 360, width: 120, height: 120 });
          canvas.add(qrImg);
        }

        canvas.renderAll();
        setCanvasReady(true);
      } catch (err) {
        console.error('Canvas draw error:', err);
      }
    };

    draw();
    return () => canvas.dispose();
  }, [finalImage, userData, orderId]);

  const downloadCanvas = () => {
    setLoading(true);
    try {
      const canvasEl = canvasRef.current;
      const dataURL = canvasEl.toDataURL('image/jpeg', 0.9);
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `id_card_${orderId || 'id'}.jpg`;
      link.click();
    } catch (err) {
      alert('Download failed');
    } finally {
      setLoading(false);
    }
  };

  const printCanvas = () => {
    setLoading(true);
    try {
      const canvasEl = canvasRef.current;
      const dataURL = canvasEl.toDataURL('image/png');
      const win = window.open('', '', 'width=400,height=600');
      win.document.write('<title>Print ID Card</title>');
      win.document.write(`<img src="${dataURL}" onload="window.print();window.close()" />`);
      win.document.close();
    } catch (err) {
      alert('Print failed');
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
          <canvas ref={canvasRef} />
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

import React, { useEffect, useRef, useState, useCallback } from "react";
import { fabric } from "fabric-pure-browser";
import { Button, Spinner } from "react-bootstrap";
import { ArrowBigDownDash, Printer, Save } from "lucide-react";
import QRCode from "qrcode";
import { capitalize } from "lodash";
import { QRCodeCanvas } from "qrcode.react";
import {
  CreateHDCanvas,
  HandlePrint,
  UploadToAPIBackground,
} from "./utils/CanvasUtils";
import { useMyContext } from "../../../../Context/MyContextProvider";

const IDCardDragAndDrop = ({
  finalImage,
  orderId,
  userData,
  userImage,
  zones = [],
  bgRequired = true,
  api,
  isEdit = true,
  isCircle = false,
  download = false,
  print = false,
}) => {
  const canvasRef = useRef(null);
  const qrCodeRef = useRef(null);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const isDraggingRef = useRef(false);
  const isLoadingStateRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [elementPositions, setElementPositions] = useState({});
  const [savedLayout, setSavedLayout] = useState();
  const [fetchingLayout, setFetchingLayout] = useState(true);
  const [centerGuides, setCenterGuides] = useState({
    vertical: null,
    horizontal: null,
    leftThird: null,
    rightThird: null,
  });
  const { authToken, ErrorAlert } = useMyContext();
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
        console.error("Failed to fetch layout:", error);
      } finally {
        setFetchingLayout(false);
      }
    };

    fetchLayout();
  }, [orderId]);

  const saveLayoutToBackend = async (layoutData) => {
    try {
      setLoading(true);
      console.log("Layout saved:", layoutData);
    } catch (error) {
      console.error("Failed to save layout:", error);
    } finally {
      setLoading(false);
    }
  };

  // Undo/Redo functionality using refs for better performance
  const saveCanvasState = useCallback((canvas) => {
    if (!canvas || isLoadingStateRef.current || isDraggingRef.current) return;
    
    const canvasState = JSON.stringify(canvas.toJSON(['name']));
    
    // Remove any history after current index
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(canvasState);
    
    // Limit history to 50 states to prevent memory issues
    if (historyRef.current.length > 50) {
      historyRef.current.shift();
    } else {
      historyIndexRef.current++;
    }
  }, []);

  const undo = useCallback((canvas) => {
    if (!canvas || historyIndexRef.current <= 0) return;
    
    const previousState = historyRef.current[historyIndexRef.current - 1];
    if (!previousState) return;
    
    historyIndexRef.current--;
    isLoadingStateRef.current = true;
    
    canvas.loadFromJSON(previousState, () => {
      canvas.renderAll();
      trackElementPositions(canvas);
      isLoadingStateRef.current = false;
    });
  }, []);

  const redo = useCallback((canvas) => {
    if (!canvas || historyIndexRef.current >= historyRef.current.length - 1) return;
    
    const nextState = historyRef.current[historyIndexRef.current + 1];
    if (!nextState) return;
    
    historyIndexRef.current++;
    isLoadingStateRef.current = true;
    
    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
      trackElementPositions(canvas);
      isLoadingStateRef.current = false;
    });
  }, []);

  const createCenterGuides = (canvas) => {
    const canvasCenter = {
      x: canvas.width / 2,
      y: canvas.height / 2,
    };

    const verticalGuide = new fabric.Line(
      [canvasCenter.x, 0, canvasCenter.x, canvas.height],
      {
        stroke: "#ff0000",
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        excludeFromExport: true,
        name: "verticalCenterGuide",
        opacity: 0,
      }
    );

    const horizontalGuide = new fabric.Line(
      [0, canvasCenter.y, canvas.width, canvasCenter.y],
      {
        stroke: "#ff0000",
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        excludeFromExport: true,
        name: "horizontalCenterGuide",
        opacity: 0,
      }
    );

    // Left third guide
    const leftThirdGuide = new fabric.Line(
      [canvas.width / 3, 0, canvas.width / 3, canvas.height],
      {
        stroke: "#00ff00",
        strokeWidth: 1,
        strokeDashArray: [3, 3],
        selectable: false,
        evented: false,
        excludeFromExport: true,
        name: "leftThirdGuide",
        opacity: 0,
      }
    );

    // Right third guide
    const rightThirdGuide = new fabric.Line(
      [(canvas.width * 2) / 3, 0, (canvas.width * 2) / 3, canvas.height],
      {
        stroke: "#00ff00",
        strokeWidth: 1,
        strokeDashArray: [3, 3],
        selectable: false,
        evented: false,
        excludeFromExport: true,
        name: "rightThirdGuide",
        opacity: 0,
      }
    );

    canvas.add(verticalGuide);
    canvas.add(horizontalGuide);
    canvas.add(leftThirdGuide);
    canvas.add(rightThirdGuide);

    setCenterGuides({
      vertical: verticalGuide,
      horizontal: horizontalGuide,
      leftThird: leftThirdGuide,
      rightThird: rightThirdGuide,
    });
    return {
      vertical: verticalGuide,
      horizontal: horizontalGuide,
      leftThird: leftThirdGuide,
      rightThird: rightThirdGuide,
    };
  };

  const showCenterGuides = useCallback((canvas, target) => {
    // Check if guides already exist, if not create them
    let guides = {
      vertical: canvas
        .getObjects()
        .find((obj) => obj.name === "verticalCenterGuide"),
      horizontal: canvas
        .getObjects()
        .find((obj) => obj.name === "horizontalCenterGuide"),
      leftThird: canvas
        .getObjects()
        .find((obj) => obj.name === "leftThirdGuide"),
      rightThird: canvas
        .getObjects()
        .find((obj) => obj.name === "rightThirdGuide"),
    };

    // If guides don't exist, create them
    if (!guides.vertical) {
      guides = createCenterGuides(canvas);
    }

    const canvasCenter = { x: canvas.width / 2, y: canvas.height / 2 };
    const leftThird = canvas.width / 3;
    const rightThird = (canvas.width * 2) / 3;
    const snapDistance = 10;

    const targetCenter = {
      x: target.left + (target.width * target.scaleX) / 2,
      y: target.top + (target.height * target.scaleY) / 2,
    };

    let showVertical = false;
    let showHorizontal = false;
    let showLeftThird = false;
    let showRightThird = false;

    // Check if target is near vertical center
    if (Math.abs(targetCenter.x - canvasCenter.x) < snapDistance) {
      showVertical = true;
      // Snap to center
      target.set({ left: canvasCenter.x - (target.width * target.scaleX) / 2 });
    }

    // Check if target is near horizontal center
    if (Math.abs(targetCenter.y - canvasCenter.y) < snapDistance) {
      showHorizontal = true;
      // Snap to center
      target.set({ top: canvasCenter.y - (target.height * target.scaleY) / 2 });
    }

    // Check if target is near left third
    if (Math.abs(targetCenter.x - leftThird) < snapDistance) {
      showLeftThird = true;
      // Snap to left third
      target.set({ left: leftThird - (target.width * target.scaleX) / 2 });
    }

    // Check if target is near right third
    if (Math.abs(targetCenter.x - rightThird) < snapDistance) {
      showRightThird = true;
      // Snap to right third
      target.set({ left: rightThird - (target.width * target.scaleX) / 2 });
    }

    // Show/hide guides based on proximity
    if (guides.vertical) {
      guides.vertical.set({ opacity: showVertical ? 0.8 : 0 });
    }
    if (guides.horizontal) {
      guides.horizontal.set({ opacity: showHorizontal ? 0.8 : 0 });
    }
    if (guides.leftThird) {
      guides.leftThird.set({ opacity: showLeftThird ? 0.8 : 0 });
    }
    if (guides.rightThird) {
      guides.rightThird.set({ opacity: showRightThird ? 0.8 : 0 });
    }

    canvas.renderAll();
  }, []);

  const hideCenterGuides = (canvas) => {
    // Find and hide guides by their names
    const guides = canvas
      .getObjects()
      .filter(
        (obj) =>
          obj.name &&
          (obj.name === "verticalCenterGuide" ||
            obj.name === "horizontalCenterGuide" ||
            obj.name === "leftThirdGuide" ||
            obj.name === "rightThirdGuide")
      );

    guides.forEach((guide) => {
      guide.set({ opacity: 0 });
    });

    canvas.renderAll();
  };

  const trackElementPositions = useCallback((canvas) => {
    const positions = {};
    canvas.getObjects().forEach((obj) => {
      if (obj.name && !obj.name.includes("CenterGuide")) {
        positions[obj.name] = {
          left: obj.left,
          top: obj.top,
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
          angle: obj.angle,
          originX: obj.originX,
          originY: obj.originY,
        };
      }
    });
    setElementPositions(positions);
    return positions;
  }, []);

  const applySavedLayout = (canvas) => {
    if (!savedLayout) return;

    canvas.getObjects().forEach((obj) => {
      if (obj.name && savedLayout[obj.name]) {
        const { left, top, scaleX, scaleY, angle, originX, originY } =
          savedLayout[obj.name];
        obj
          .set({
            left,
            top,
            scaleX,
            scaleY,
            angle,
            originX,
            originY,
          })
          .setCoords();
      }
    });
    canvas.renderAll();
  };

  // Canvas initialization effect - runs only when essential props change
  useEffect(() => {
    if (!canvasRef.current || !finalImage || fetchingLayout) return;

    let isMounted = true;
    let canvas;

    const setupEventListeners = (canvasInstance) => {
      // Track drag start to prevent state saving during drag
      canvasInstance.on("object:moving", (e) => {
        isDraggingRef.current = true;
        if (isEdit) {
          showCenterGuides(canvasInstance, e.target);
        }
      });

      // Handle drag end and save state
      canvasInstance.on("object:moved", () => {
        isDraggingRef.current = false;
        if (isEdit) {
          hideCenterGuides(canvasInstance);
          // Save state after drag is complete
          setTimeout(() => {
            trackElementPositions(canvasInstance);
            saveCanvasState(canvasInstance);
          }, 10);
        }
      });

      // Handle other modifications (scaling, rotating, etc.)
      canvasInstance.on("object:modified", () => {
        if (!isDraggingRef.current) {
          trackElementPositions(canvasInstance);
          saveCanvasState(canvasInstance);
        }
      });

      canvasInstance.on("object:added", () => {
        // Save state when objects are added (but not during initial setup or dragging)
        if (canvasReady && !isDraggingRef.current) {
          setTimeout(() => {
            saveCanvasState(canvasInstance);
          }, 10);
        }
      });

      canvasInstance.on("object:removed", () => {
        // Save state when objects are removed (but not during dragging)
        if (canvasReady && !isDraggingRef.current) {
          setTimeout(() => {
            saveCanvasState(canvasInstance);
          }, 10);
        }
      });

      // Hide guides on mouse up (drag end)
      canvasInstance.on("mouse:up", () => {
        isDraggingRef.current = false;
        if (isEdit) {
          hideCenterGuides(canvasInstance);
        }
      });

      // Hide guides when selection is cleared
      canvasInstance.on("selection:cleared", () => {
        if (isEdit) {
          hideCenterGuides(canvasInstance);
        }
      });

      // Hide guides when starting a new selection
      canvasInstance.on("selection:created", () => {
        if (isEdit) {
          hideCenterGuides(canvasInstance);
        }
      });
    };

    const initCanvas = async () => {
      try {
        canvas = new fabric.Canvas(canvasRef.current, {
          selection: isEdit,
          preserveObjectStacking: true,
        });

        // Store canvas reference for content updates
        canvasRef.current.fabricCanvas = canvas;

        // Load background image
        const bgImg = await new Promise((resolve) => {
          fabric.Image.fromURL(
            finalImage,
            (img) => {
              if (!img || !isMounted) return;
              const displayWidth = 400;
              const scaleFactor = displayWidth / img.width;
              const displayHeight = img.height * scaleFactor;

              canvas.setDimensions({
                width: displayWidth,
                height: displayHeight,
              });
              img.scaleX = scaleFactor;
              img.scaleY = scaleFactor;
              img.selectable = false;
              img.evented = false;
              resolve(img);
            },
            { crossOrigin: "anonymous" }
          );
        });

        if (!isMounted) return;

        if (bgRequired) {
          canvas.setBackgroundImage(bgImg, () => {
            if (canvas.contextContainer) canvas.renderAll();
          });
        } else {
          canvas.setBackgroundColor("white", () => {
            if (canvas.contextContainer) canvas.renderAll();
          });
        }

        setupEventListeners(canvas);
        
        if (isMounted) setCanvasReady(true);
      } catch (err) {
        console.error("Canvas initialization error:", err);
      }
    };

    initCanvas();

    return () => {
      isMounted = false;
      if (canvas) {
        canvas.dispose();
        const currentCanvasRef = canvasRef.current;
        if (currentCanvasRef) {
          currentCanvasRef.fabricCanvas = null;
        }
      }
    };
  }, [finalImage, fetchingLayout, bgRequired, isEdit, canvasReady, redo, saveCanvasState, showCenterGuides, trackElementPositions, undo]);

  // Keyboard event listener effect
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isEdit || !canvasRef.current?.fabricCanvas) return;
      
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo(canvasRef.current.fabricCanvas);
        } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          redo(canvasRef.current.fabricCanvas);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEdit, undo, redo]);

  // Content update effect - runs when userData or other content changes
  useEffect(() => {
    if (!canvasRef.current?.fabricCanvas || !userData || !canvasReady) return;

    const canvas = canvasRef.current.fabricCanvas;
    
    const updateCanvasContent = async () => {
      try {
        // Remove existing content (but keep guides)
        const objectsToRemove = canvas.getObjects().filter(obj => 
          obj.name && !obj.name.includes('Guide')
        );
        objectsToRemove.forEach(obj => canvas.remove(obj));

        // Add user image (circle or rounded square)
        if (userImage) {
          const photo = await new Promise((resolve) => {
            fabric.Image.fromURL(
              userImage,
              (img) => {
                if (!img) return;

                const circleCenterX = 200;
                const circleCenterY = 235;
                const circleRadius = 70;
                const boxSize = circleRadius * 2.5 * 1.05;
                const baseSize = Math.max(img.width, img.height);
                const scale = boxSize / baseSize;

                const clipShape = isCircle
                  ? new fabric.Circle({
                      radius: circleRadius,
                      originX: "center",
                      originY: "center",
                    })
                  : new fabric.Rect({
                      width: boxSize,
                      height: boxSize,
                      rx: 20,
                      ry: 20,
                      originX: "center",
                      originY: "center",
                    });

                img.set({
                  left: savedLayout?.userPhoto?.left || circleCenterX,
                  top: savedLayout?.userPhoto?.top || circleCenterY,
                  originX: "center",
                  originY: "center",
                  scaleX: savedLayout?.userPhoto?.scaleX || scale,
                  scaleY: savedLayout?.userPhoto?.scaleY || scale,
                  selectable: isEdit,
                  evented: isEdit,
                  hasControls: isEdit,
                  hasBorders: isEdit,
                  name: "userPhoto",
                  clipPath: clipShape,
                });

                resolve(img);
              },
              { crossOrigin: "anonymous" }
            );
          });

          canvas.add(photo);
        }

        // Add text elements
        const addTextElement = (text, name, defaultLeft, defaultTop) => {
          const savedPos = savedLayout?.[name];
          return new fabric.Text(text, {
            fontSize: 18,
            fontFamily: "Arial",
            fill: "#076066",
            fontWeight: "bold",
            left: savedPos?.left || defaultLeft,
            top: savedPos?.top || defaultTop,
            originX: savedPos?.originX || "center",
            originY: savedPos?.originY || "top",
            scaleX: savedPos?.scaleX || 1,
            scaleY: savedPos?.scaleY || 1,
            angle: savedPos?.angle || 0,
            selectable: isEdit,
            evented: isEdit,
            hasControls: isEdit,
            hasBorders: isEdit,
            name: name,
          });
        };

        const valueLeft = canvas?.width / 2;
        const startTop = 320;
        const verticalGap = 25;

        const values = [
          capitalize(userData?.name) || "User Name",
          capitalize(userData?.designation) || "Designation",
          capitalize(userData?.company_name || userData?.comp_name) ||
            "Company Name",
        ];

        values.forEach((text, i) => {
          canvas.add(
            addTextElement(
              text,
              `textValue_${i}`,
              valueLeft,
              startTop + i * verticalGap
            )
          );
        });

        // QR Code
        if (orderId) {
          try {
            const qrDataURL = await QRCode.toDataURL(orderId, { margin: 0.5 });
            const qrImg = await new Promise((resolve) => {
              fabric.Image.fromURL(
                qrDataURL,
                (img) => {
                  if (!img) return;

                  const qrCodeWidth = 100;
                  const qrCodeHeight = 100;
                  const qrPositionX = 155;
                  const qrPositionY = 410;

                  img.set({
                    left: savedLayout?.qrCode?.left || qrPositionX,
                    top: savedLayout?.qrCode?.top || qrPositionY,
                    scaleX:
                      savedLayout?.qrCode?.scaleX || qrCodeWidth / img.width,
                    scaleY:
                      savedLayout?.qrCode?.scaleY || qrCodeHeight / img.height,
                    originX: "left",
                    originY: "top",
                    selectable: isEdit,
                    evented: isEdit,
                    hasControls: isEdit,
                    hasBorders: isEdit,
                    name: "qrCode",
                  });

                  resolve(img);
                },
                { crossOrigin: "anonymous" }
              );
            });

            canvas.add(qrImg);
          } catch (err) {
            console.error("QR Code Error:", err);
          }
        }

        // Zone Boxes - Create as a group for easier positioning
        const boxWidth = 28;
        const boxHeight = 28;
        const boxPadding = 8;
        const numBoxes = zones?.length ?? 0;
        const totalBoxesWidth = numBoxes * boxWidth + (numBoxes - 1) * boxPadding;
        const boxStartX = (canvas?.width - totalBoxesWidth) / 2;
        const boxStartY = 530;
        const borderRadius = 8;

        const userZones = userData?.company?.zone
          ? Array.isArray(userData.company.zone)
            ? userData.company.zone
            : JSON.parse(userData.company.zone)
          : [];

        if (numBoxes > 0) {
          const zoneElements = [];
          
          for (let i = 0; i < numBoxes; i++) {
            const currentZone = zones[i];
            const isUserZone = userZones.includes(currentZone?.id || currentZone);

            const box = new fabric.Rect({
              left: i * (boxWidth + boxPadding),
              top: 0,
              width: boxWidth,
              height: boxHeight,
              fill: isUserZone ? "#076066" : "#f0f0f0",
              rx: borderRadius,
              ry: borderRadius,
              stroke: "#076066",
              strokeWidth: 2,
              selectable: false,
              evented: false,
            });

            const label = isUserZone
              ? new fabric.Text("✓", {
                  fontSize: 16,
                  fill: "white",
                  fontWeight: "bold",
                })
              : new fabric.Text((i + 1).toString(), {
                  fontSize: 14,
                  fill: "#076066",
                  fontWeight: "bold",
                });

            label.set({
              left: i * (boxWidth + boxPadding) + boxWidth / 2,
              top: boxHeight / 2,
              originX: "center",
              originY: "center",
              fontFamily: "Arial",
              selectable: false,
              evented: false,
            });

            zoneElements.push(box, label);
          }

          // Create a group from all zone elements
          const zoneGroup = new fabric.Group(zoneElements, {
            left: savedLayout?.zoneGroup?.left || boxStartX,
            top: savedLayout?.zoneGroup?.top || boxStartY,
            originX: savedLayout?.zoneGroup?.originX || "left",
            originY: savedLayout?.zoneGroup?.originY || "top",
            scaleX: savedLayout?.zoneGroup?.scaleX || 1,
            scaleY: savedLayout?.zoneGroup?.scaleY || 1,
            angle: savedLayout?.zoneGroup?.angle || 0,
            selectable: isEdit,
            evented: isEdit,
            hasControls: isEdit,
            hasBorders: isEdit,
            name: "zoneGroup",
            lockRotation: false,
            lockScalingFlip: true,
          });

          canvas.add(zoneGroup);
        }

        applySavedLayout(canvas);
        trackElementPositions(canvas);
        canvas.renderAll();
        
        // Save initial state for undo/redo after a small delay to ensure everything is loaded
        setTimeout(() => {
          saveCanvasState(canvas);
        }, 100);
      } catch (err) {
        console.error("Content update error:", err);
      }
    };

    updateCanvasContent();
  }, [userData, userImage, orderId, savedLayout, zones, isEdit, isCircle, canvasReady]);

  const downloadCanvas = async () => {
    setLoading(true);
    try {
      const hdCanvas = await CreateHDCanvas({
        finalImage,
        userImage,
        userData,
        orderId,
        zones,
        bgRequired,
      });

      hdCanvas.renderAll();
      const dataURL = hdCanvas.toDataURL({ format: "png", quality: 1.0 });

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `id_card_${orderId || "id"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const filename = `id_card_${orderId || "id"}.png`;
      UploadToAPIBackground({
        dataURL,
        filename,
        userId: userData?.id,
        api,
        authToken,
      }).then((result) => {
        if (result) {
          // toast.success('ID Card uploaded to server');
        }
      });

      hdCanvas.dispose();
    } catch (err) {
      alert("HD Download failed. Please try again.");
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
        bgRequired,
      });

      await HandlePrint({
        hdCanvas,
        orderId,
        userId: userData.id,
        api,
        authToken,
        ErrorAlert,
      });

      hdCanvas.dispose();
    } catch (err) {
      console.error("Print process failed:", err);
      alert("Printing failed. Please try again.");
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
            {loading ? "Saving..." : "Save Layout"}
            <Save size={16} />
          </Button>
        )}
        {download && (
          <Button
            variant="primary"
            onClick={downloadCanvas}
            disabled={!canvasReady || loading}
            className="d-flex align-items-center gap-2"
          >
            {loading ? "Please Wait..." : "Download"}
            <ArrowBigDownDash size={16} />
          </Button>
        )}
        {print && (
          <Button
            variant="secondary"
            onClick={printCanvas}
            disabled={!canvasReady || loading}
            className="d-flex align-items-center gap-2"
          >
            Print
            <Printer size={16} />
          </Button>
        )}
      </div>

      <div
        style={{ display: "flex", justifyContent: "center", overflow: "auto" }}
      >
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
            <canvas ref={canvasRef} style={{ display: "block" }} />
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

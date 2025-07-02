import React from "react";
import {  Col } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import CanvasSettings from "./CanvasSettings";

const CategoryFilePreview = (props) => {
  const { formFields, formData, setLayoutData } = props;

  // Constants
  const layoutDimensions = {
    layout1: { width: 321, height: 204 },
    layout2: { width: 397, height: 204 },
    layout3: { width: 529, height: 204 },
    layout4: { width: 529, height: 204 },
  };

  const scaleFactor = 1;

  // Logic
  const fileField = formFields.find((f) => f.type === "file");
  
  if (!fileField) return null;

  const previewUrl = formData[`${fileField.name}PreviewUrl`];
  const existingUrl = typeof formData[fileField.name] === "string" 
    ? formData[fileField.name] 
    : null;
  const src = previewUrl || existingUrl;
  const selectedLayoutId = formData[`${fileField.name}Layout`];
  const layout = layoutDimensions[selectedLayoutId] || layoutDimensions["layout1"];
  const boxWidth = layout.width * scaleFactor;
  const boxHeight = layout.height * 1.5;

  // Animation configurations
  const imageAnimationProps = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3, ease: "easeOut" }
  };

  const placeholderAnimationProps = {
    initial: { 
      opacity: 0, 
      scale: 0.8, 
      width: `${boxWidth}px`, 
      height: "20px" 
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      width: `${boxWidth}px`, 
      height: [`20px`, `${boxHeight * 1.15}px`, `${boxHeight}px`]
    },
    transition: { 
      duration: 0.8, 
      ease: "easeInOut",
      height: { 
        duration: 1.2,
        times: [0, 0.6, 1],
        ease: [0.16, 1, 0.3, 1]
      },
      scale: { 
        duration: 0.5, 
        ease: "backOut",
        delay: 0.1
      },
      opacity: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const textAnimationProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.2, duration: 0.3 }
  };

  const noLayoutAnimationProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  // Render functions
  const renderImagePreview = () => (
    <AnimatePresence mode="wait">
      <motion.img
        key={src}
        src={src}
        alt="Preview"
        {...imageAnimationProps}
        style={{
          maxHeight: "100%",
          maxWidth: "100%",
          objectFit: "contain",
          borderRadius: "8px",
          border: "1px solid #dee2e6",
        }}
      />
    </AnimatePresence>
  );

  const renderPlaceholder = () => (
    <div
      key={`${selectedLayoutId || 'layout1'}-${boxWidth}-${boxHeight}`}
      className="d-flex flex-column justify-content-center align-items-center text-muted"
      {...placeholderAnimationProps}
      style={{
        border: "2px dashed var(--bs-secondary)",
        borderRadius: "8px",
        fontSize: "14px",
        textAlign: "center",
        padding: "10px",
        // width: `${boxWidth}px`,
        height: `${boxHeight}px`,
        overflow: "hidden",
      }}
    >
      <motion.div {...textAnimationProps}>
        No file selected
        <br />
        {selectedLayoutId && (
          <small>
            Expected size: {layout.width}×{layout.height}px
          </small>
        )}
      </motion.div>
    </div>
  );

  const renderNoLayout = () => (
    <motion.div 
      className="text-muted text-center"
      {...noLayoutAnimationProps}
    >
      No layout selected
    </motion.div>
  );

  const renderContent = () => {
    if (src) {
      return renderImagePreview();
    }
    
    if (layout) {
      return renderPlaceholder();
    }
    
    return renderNoLayout();
  };

  return (
    <Col lg={4} className="d-flex justify-content-center align-items-center">
      <div className="d-flex flex-column align-items-center gap-2 w-100">
      <CanvasSettings previewUrl={src} setLayoutData={setLayoutData} />
      {renderContent()}
    </div>
    </Col>
  );
};

export default CategoryFilePreview;

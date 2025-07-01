import { Check } from "lucide-react";
import { Form } from "react-bootstrap";

const ImageStyleSelector = ({ isCircle, setIsCircle }) => {
  const renderOption = (label, isSelected, onClick, isCircular) => {
    return (
      <div
        className={`position-relative shadow-sm transition cursor-pointer ${
          isSelected ? "border-primary border-2" : "border border-light"
        }`}
        style={{
          width: "90px",
          height: "90px",
          borderRadius: isCircular ? "50%" : "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f1f3f5",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={onClick}
      >
        <span className="text-dark fw-medium small">{label}</span>
        {isSelected && (
          <div
            className="position-absolute bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "22px",
              height: "22px",
              top: "-6px",
              right: "-6px",
              fontSize: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            <Check size={14} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mb-4">
      <Form.Label className="fw-semibold text-secondary">Image Style</Form.Label>
      <div className="d-flex gap-4 mt-2">
        {renderOption("Circle", isCircle, () => setIsCircle(true), true)}
        {renderOption("Square", !isCircle, () => setIsCircle(false), false)}
      </div>
    </div>
  );
};

export default ImageStyleSelector;

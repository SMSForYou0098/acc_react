import React from "react";
import {
  FileText,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  FileCode2,
  File,
} from "lucide-react";

const getLucideFileIcon = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();

  switch (ext) {
    case "pdf":
      return <FileText className="text-danger" size={18} />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
      return <FileImage className="text-primary" size={18} />;
    case "doc":
    case "docx":
      return <FileText className="text-info" size={18} />;
    case "xls":
    case "xlsx":
      return <FileSpreadsheet className="text-success" size={18} />;
    case "zip":
    case "rar":
      return <FileArchive className="text-warning" size={18} />;
    case "js":
    case "ts":
    case "json":
    case "html":
    case "css":
      return <FileCode2 className="text-secondary" size={18} />;
    case "txt":
      return <FileText className="text-muted" size={18} />;
    default:
      return <File className="text-secondary" size={18} />;
  }
};

const truncateFileName = (filename, maxLength = 20) => {
  const name = filename.split("/").pop();
  if (name.length <= maxLength) return name;

  const ext = name.includes(".") ? "." + name.split(".").pop() : "";
  return name.slice(0, maxLength - ext.length - 3) + "..." + ext;
};

const FilePreview = ({ filePath, className = "", style = {} }) => {
  if (!filePath || typeof filePath !== "string") return null;

  return (
    <div
      className={`d-flex align-items-center gap-2 file-preview-item ${className}`}
      style={style}
    >
      {getLucideFileIcon(filePath)}
      <span
        className="file-name text-truncate"
        title={filePath.split("/").pop()}
        style={{ fontSize: "0.9em" }}
      >
        {truncateFileName(filePath)}
      </span>
    </div>
  );
};

export default FilePreview;

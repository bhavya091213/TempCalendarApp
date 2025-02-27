import React, { useState } from "react";

type ModalProps = {
  onCreateNew: () => void;
  onUploadCSV: (csvContent: string) => void;
};

const Modal: React.FC<ModalProps> = ({ onCreateNew, onUploadCSV }) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (csvFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === "string") {
          onUploadCSV(text);
        }
      };
      reader.readAsText(csvFile);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#FBFCFF",
          padding: "20px",
          borderRadius: "8px",
          width: "300px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#1E1E1E" }}>Welcome</h2>
        <button
          onClick={onCreateNew}
          style={{
            margin: "10px",
            padding: "10px",
            background: "#1C6E8C",
            color: "white",
            border: "none",
            borderRadius: "5px",
            width: "100%",
            textAlign: "center",
          }}
        >
          Create New Calendar
        </button>
        <div style={{ margin: "10px" }}>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <button
            onClick={handleUpload}
            style={{
              marginTop: "10px",
              padding: "10px",
              background: "#274156",
              color: "white",
              border: "none",
              borderRadius: "5px",
              width: "100%",
              textAlign: "center",
            }}
          >
            Upload CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

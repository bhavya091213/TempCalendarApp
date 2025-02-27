import React, { useState } from "react";

type AddEventModalProps = {
  currentMonth: number;
  onClose: () => void;
  onAddEvent: (month: number, day: number, title: string) => void;
};

const AddEventModal: React.FC<AddEventModalProps> = ({
  currentMonth,
  onClose,
  onAddEvent,
}) => {
  const [month, setMonth] = useState(currentMonth);
  const [day, setDay] = useState(1);
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEvent(month, day, title);
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
        alignItems: "center",
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
        <h3 style={{ color: "#1E1E1E" }}>Add Event</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ color: "#1E1E1E" }}>Month:</label>
            <input
              type="number"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              min="1"
              max="12"
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ color: "#1E1E1E" }}>Day:</label>
            <input
              type="number"
              value={day}
              onChange={(e) => setDay(parseInt(e.target.value))}
              min="1"
              max="31"
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ color: "#1E1E1E" }}>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <button
            type="submit"
            style={{
              marginRight: "10px",
              background: "#1C6E8C",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            Add
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#274156",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;

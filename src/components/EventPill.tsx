import React, { useState } from "react";
import { CalendarEvent } from "../App";

type EventPillProps = {
  event: CalendarEvent;
  removeEvent: (id: string) => void;
};

const EventPill: React.FC<EventPillProps> = ({ event, removeEvent }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: "#274156",
        color: "white",
        padding: "5px 10px",
        borderRadius: "15px",
        marginBottom: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          flex: 1,
        }}
      >
        {event.title}
      </span>
      {hovered && (
        <span
          onClick={() => removeEvent(event.id)}
          style={{ marginLeft: "10px", cursor: "pointer" }}
        >
          x
        </span>
      )}
    </div>
  );
};

export default EventPill;

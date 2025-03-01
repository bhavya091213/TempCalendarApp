import React from "react";
import { CalendarEvent } from "../App";
import EventPill from "./EventPill";

type CalendarProps = {
  events: CalendarEvent[];
  currentMonth: number;
  setCurrentMonth: (month: number) => void;
  removeEvent: (id: string) => void;
};

const Calendar: React.FC<CalendarProps> = ({
  events,
  currentMonth,
  setCurrentMonth,
  removeEvent,
}) => {
  // Number of days in the given month for 2025
  const daysInMonth = new Date(2025, currentMonth, 0).getDate();

  // Compute the weekday of the 1st of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = new Date(2025, currentMonth - 1, 1).getDay();

  // Array of day numbers for the month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Days-of-the-week labels
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevDisabled = currentMonth === 1;
  const nextDisabled = currentMonth === 12;

  const handlePrev = () => {
    if (currentMonth > 1) setCurrentMonth(currentMonth - 1);
  };

  const handleNext = () => {
    if (currentMonth < 12) setCurrentMonth(currentMonth + 1);
  };

  // Calculate a fixed width based on viewport; use it as both width and minimum height.
  const cellSize = "calc((100vw - 80px) / 7)";

  return (
    <div style={{ padding: "20px" }}>
      {/* Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={handlePrev}
          disabled={prevDisabled}
          style={{
            background: "#1C6E8C",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          Prev
        </button>
        <h2 style={{ color: "#1E1E1E" }}>
          {new Date(2025, currentMonth - 1).toLocaleString("default", {
            month: "long",
          })}{" "}
          2025
        </h2>
        <button
          onClick={handleNext}
          disabled={nextDisabled}
          style={{
            background: "#1C6E8C",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          Next
        </button>
      </div>

      {/* Days-of-the-Week Header (placed above the grid) */}
      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {daysOfWeek.map((dayName) => (
          <div
            key={dayName}
            style={{
              width: cellSize,
              textAlign: "center",
              fontWeight: "bold",
              color: "#605856",
            }}
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "10px",
        }}
      >
        {/* Render empty placeholders for offset */}
        {Array.from({ length: firstDayOfWeek }).map((_, index) => (
          <div
            key={`placeholder-${index}`}
            style={{
              width: cellSize,
              minHeight: cellSize,
            }}
          />
        ))}
        {/* Render day boxes */}
        {days.map((day) => {
          const dayEvents = events.filter(
            (ev) => ev.month === currentMonth && ev.day === day
          );
          return (
            <div
              key={day}
              style={{
                width: cellSize,
                minHeight: cellSize,
                border: "1px solid #D0CCD0",
                padding: "10px",
                position: "relative",
                boxSizing: "border-box",
                borderRadius: "15px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  fontSize: "12px",
                  color: "#605856",
                }}
              >
                {day}
              </div>
              <div style={{ marginTop: "20px" }}>
                {dayEvents.map((ev) => (
                  <EventPill key={ev.id} event={ev} removeEvent={removeEvent} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;

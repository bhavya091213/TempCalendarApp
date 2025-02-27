import React, { useState } from "react";
import Modal from "./components/Modal";
import Calendar from "./components/Calendar";
import AddEventModal from "./components/AddEventModal";

export type CalendarEvent = {
  id: string;
  month: number;
  day: number;
  title: string;
};

const App: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [showAddEvent, setShowAddEvent] = useState(false);

  // Handle CSV upload (CSV columns: month, day, title)
  const handleCSVUpload = (csvContent: string) => {
    // Split the CSV content into lines, trim whitespace, and remove any empty lines
    let lines = csvContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    // Optional: If the first line contains headers, remove it
    if (lines.length > 0) {
      const firstLine = lines[0].toLowerCase();
      // If it contains "month", "day", and "title", treat it as a header row
      if (
        firstLine.includes("month") &&
        firstLine.includes("day") &&
        firstLine.includes("title")
      ) {
        lines.shift(); // remove the header line
      }
    }

    const newEvents: CalendarEvent[] = [];

    lines.forEach((line, index) => {
      const parts = line.split(",");
      if (parts.length < 3) return; // skip invalid rows

      const [monthStr, dayStr, ...titleParts] = parts;
      const month = parseInt(monthStr, 10);
      const day = parseInt(dayStr, 10);
      const title = titleParts.join(",").trim(); // re-join if the title had commas

      // Validate the parsed numbers
      if (isNaN(month) || isNaN(day) || !title) {
        return; // skip invalid rows
      }

      // Create the event
      newEvents.push({
        id: `${month}-${day}-${Date.now()}-${index}`,
        month,
        day,
        title,
      });
    });

    // If we successfully parsed events, set them and pick a month to display
    if (newEvents.length > 0) {
      setEvents(newEvents);

      // Option 1: Just use the first event’s month
      setCurrentMonth(newEvents[0].month);

      // Option 2: Or pick the earliest month:
      // const earliestMonth = Math.min(...newEvents.map(ev => ev.month));
      // setCurrentMonth(earliestMonth);
    }

    // Close the modal regardless
    setShowModal(false);
  };

  const handleCreateNew = () => {
    setEvents([]);
    setCurrentMonth(new Date().getMonth() + 1);
    setShowModal(false);
  };

  const addEvent = (month: number, day: number, title: string) => {
    const newEvent: CalendarEvent = {
      id: `${month}-${day}-${Date.now()}`,
      month,
      day,
      title,
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const removeEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const exportCSV = () => {
    let csvContent = "month,day,title\n";
    events.forEach((ev) => {
      csvContent += `${ev.month},${ev.day},${ev.title}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "calendar.csv");
    link.click();
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#FBFCFF",
      }}
    >
      {showModal && (
        <Modal onCreateNew={handleCreateNew} onUploadCSV={handleCSVUpload} />
      )}
      <div style={{ filter: showModal ? "blur(5px)" : "none" }}>
        <Calendar
          events={events}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          removeEvent={removeEvent}
        />
        <button
          onClick={() => setShowAddEvent(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#1C6E8C",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            fontSize: "24px",
          }}
        >
          +
        </button>
        <button
          onClick={exportCSV}
          style={{
            position: "fixed",
            bottom: "20px",
            left: "20px",
            background: "#274156",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          Export CSV
        </button>
      </div>
      {showAddEvent && (
        <AddEventModal
          currentMonth={currentMonth}
          onClose={() => setShowAddEvent(false)}
          onAddEvent={(month, day, title) => {
            addEvent(month, day, title);
            setShowAddEvent(false);
          }}
        />
      )}
    </div>
  );
};

export default App;

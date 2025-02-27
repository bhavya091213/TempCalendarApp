import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import Calendar from "./components/Calendar";
import AddEventModal from "./components/AddEventModal";

export type CalendarEvent = {
  id: string;
  month: number;
  day: number;
  title: string;
};

const COOKIE_KEY = "calendarData";

// Refactored cookie functions
const setCalendarCookie = (data: string) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);
  Cookies.set(COOKIE_KEY, data, { path: "/", expires: expirationDate });
};

const getCalendarCookie = (): string | undefined => {
  return Cookies.get(COOKIE_KEY);
};

const removeCalendarCookie = () => {
  Cookies.remove(COOKIE_KEY, { path: "/" });
};

const App: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [confirmNewCalendar, setConfirmNewCalendar] = useState(false);

  // Ref for hidden file input (for CSV uploads)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper: Generate CSV from current events
  const generateCSV = (): string => {
    let csvContent = "month,day,title\n";
    events.forEach((ev) => {
      csvContent += `${ev.month},${ev.day},${ev.title}\n`;
    });
    return csvContent;
  };

  // Whenever events change, update the cookie with an encoded CSV string.
  useEffect(() => {
    const csvContent = generateCSV();
    const encodedCsv = btoa(csvContent);
    setCalendarCookie(encodedCsv);
  }, [events]);

  // On initial load, check for encoded CSV cookie and load it.
  useEffect(() => {
    const encodedCsv = getCalendarCookie();
    if (encodedCsv) {
      try {
        const csvContent = atob(encodedCsv);
        handleCSVUpload(csvContent);
      } catch (error) {
        console.error("Error decoding calendar data from cookie:", error);
      }
    }
  }, []);

  // Also check the URL for an encoded CSV (from a share link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedCsvFromUrl = params.get("data");
    if (encodedCsvFromUrl) {
      try {
        const csvContent = atob(encodedCsvFromUrl);
        handleCSVUpload(csvContent);
        // Remove query parameter from URL
        const url = window.location.origin + window.location.pathname;
        window.history.replaceState(null, "", url);
      } catch (error) {
        console.error("Error decoding CSV from URL:", error);
      }
    }
  }, []);

  // Process CSV content (from file upload or from cookie/share link)
  const handleCSVUpload = (csvContent: string) => {
    let lines = csvContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    // Remove header row if present
    if (
      lines.length > 0 &&
      lines[0].toLowerCase().includes("month") &&
      lines[0].toLowerCase().includes("day") &&
      lines[0].toLowerCase().includes("title")
    ) {
      lines.shift();
    }

    const newEvents: CalendarEvent[] = [];
    lines.forEach((line, index) => {
      const parts = line.split(",");
      if (parts.length < 3) return;
      const month = parseInt(parts[0].trim(), 10);
      const day = parseInt(parts[1].trim(), 10);
      const title = parts.slice(2).join(",").trim();
      if (isNaN(month) || isNaN(day) || !title) return;
      newEvents.push({
        id: `${month}-${day}-${Date.now()}-${index}`,
        month,
        day,
        title,
      });
    });

    if (newEvents.length > 0) {
      setEvents(newEvents);
      setCurrentMonth(newEvents[0].month);
    }
  };

  // Create a new calendar: clear events and remove the cookie
  const handleCreateNew = () => {
    removeCalendarCookie();
    setEvents([]);
    setCurrentMonth(new Date().getMonth() + 1);
    setConfirmNewCalendar(false);
  };

  // Handle file input change: read CSV and load events
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleCSVUpload(text);
    };
    reader.readAsText(file);
    // Reset input so the same file can be uploaded again if needed.
    e.target.value = "";
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
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "calendar.csv");
    link.click();
  };

  // Share flow: generate CSV, encode it, build share URL, copy it to clipboard, and show notification.
  const shareCalendar = () => {
    const csvContent = generateCSV();
    const encodedCsv = btoa(csvContent);
    const shareUrl = `${window.location.origin}${window.location.pathname}?data=${encodedCsv}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setShowShareNotification(true);
        setTimeout(() => setShowShareNotification(false), 5000);
      })
      .catch((err) => console.error("Failed to copy share URL:", err));
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#FBFCFF",
      }}
    >
      {/* Calendar Component */}
      <Calendar
        events={events}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        removeEvent={removeEvent}
      />

      {/* Add Event Button */}
      <button
        onClick={() => setShowAddEvent(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          background: "#1C6E8C",
          display: "flex",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          fontSize: "24px",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        +
      </button>

      {/* Left Controls: New Calendar & Upload CSV */}
      <div style={{ position: "fixed", bottom: "70px", left: "20px" }}>
        {!confirmNewCalendar ? (
          <button
            onClick={() => setConfirmNewCalendar(true)}
            style={{
              background: "#274156",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "10px",
              marginBottom: "10px",
              display: "block",
            }}
          >
            New Calendar
          </button>
        ) : (
          <button
            onClick={handleCreateNew}
            style={{
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "10px",
              marginBottom: "10px",
              display: "block",
            }}
          >
            Click again to confirm
          </button>
        )}

        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: "#274156",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "10px",
            display: "block",
            marginBottom: "10px",
          }}
        >
          Upload CSV
        </button>
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {/* Right Controls: Share & Export CSV */}
      <button
        onClick={shareCalendar}
        style={{
          position: "fixed",
          bottom: "70px",
          right: "20px",
          background: "#274156",
          color: "white",
          border: "none",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        Share
      </button>
      <button
        onClick={exportCSV}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#274156",
          color: "white",
          border: "none",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        Export CSV
      </button>

      {/* Add Event Modal */}
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

      {/* Share Notification */}
      {showShareNotification && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(28,110,140,0.8)",
            backdropFilter: "blur(5px)",
            padding: "10px 20px",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            zIndex: 1001,
          }}
        >
          <span style={{ marginRight: "10px" }}>
            Share link copied to clipboard!
          </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setShowShareNotification(false)}
          >
            x
          </span>
        </div>
      )}
    </div>
  );
};

export default App;

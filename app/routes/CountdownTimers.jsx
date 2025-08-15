import React, { useState } from "react";

function Modal({ open, onClose, title, children, onPrimary, primaryText = "Save" }) {
  if (!open) return null;
  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={{ margin: 0 }}>{title}</h3>
        </div>
        <div style={styles.modalBody}>{children}</div>
        <div style={styles.modalFooter}>
          <button onClick={onClose} style={styles.button}>
            Cancel
          </button>
          <button onClick={onPrimary} style={{ ...styles.button, ...styles.primary }}>
            {primaryText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <CountdownTimers />;
}

function CountdownTimers() {
  const [modalOpen, setModalOpen] = useState(false);
  const [timers, setTimers] = useState([
    {
      id: 1,
      timerName: "Summer Sale",
      startTime: "2025-08-15T09:00",
      endTime: "2025-08-20T23:59",
      promotionText: "Up to 50% off on summer collection!",
      displayOptions: { color: "hsl(0,100%,50%)", size: "large", position: "top" },
      urgency: { enabled: true, type: "colorPulse" },
    },
    {
      id: 2,
      timerName: "Flash Deal",
      startTime: "2025-08-16T12:00",
      endTime: "2025-08-16T18:00",
      promotionText: "Limited time flash deal!",
      displayOptions: { color: "hsl(240,100%,50%)", size: "medium", position: "bottom" },
      urgency: { enabled: true, type: "notificationBanner" },
    },
  ]);

  const [timerName, setTimerName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [promotionDesc, setPromotionDesc] = useState("");
  const [hsb, setHsb] = useState({ hue: 120, saturation: 100, brightness: 50 });
  const [timerSize, setTimerSize] = useState("medium");
  const [timerPosition, setTimerPosition] = useState("top");
  const [urgency, setUrgency] = useState("colorPulse");

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleCreate() {
    const color = `hsl(${hsb.hue},${hsb.saturation}%,${hsb.brightness}%)`;
    const newTimer = {
      id: Date.now(),
      timerName,
      startTime: `${startDate}T${startTime}`,
      endTime: `${endDate}T${endTime}`,
      promotionText: promotionDesc,
      displayOptions: { color, size: timerSize, position: timerPosition },
      urgency: { enabled: urgency !== "none", type: urgency },
    };
    setTimers((prev) => [...prev, newTimer]);
    resetForm();
    closeModal();
  }

  function resetForm() {
    setTimerName("");
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
    setPromotionDesc("");
    setHsb({ hue: 120, saturation: 100, brightness: 50 });
    setTimerSize("medium");
    setTimerPosition("top");
    setUrgency("colorPulse");
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={{ margin: 0 }}>Countdown Timer Manager</h1>
        <button style={{ ...styles.button, ...styles.primary }} onClick={openModal}>
          + Create timer
        </button>
      </div>

      <div style={styles.card}>
        {timers.length === 0 ? (
          <div style={{ padding: 16, color: "#666" }}>No timers created.</div>
        ) : (
          <ul style={styles.list}>
            {timers.map((t) => (
              <li key={t.id} style={styles.listItem}>
                <div style={{ fontWeight: 700 }}>{t.timerName}</div>
                <div style={{ margin: "4px 0" }}>{t.promotionText}</div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {t.startTime} — {t.endTime}
                </div>
                <div style={{ marginTop: 6, fontSize: 12 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 14,
                      height: 14,
                      marginRight: 6,
                      borderRadius: 3,
                      verticalAlign: "middle",
                      background: t.displayOptions.color,
                    }}
                  />
                  {t.displayOptions.size}, {t.displayOptions.position}, urgency: {t.urgency.type}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="Create New Timer"
        onPrimary={handleCreate}
        primaryText="Create timer"
      >
        <div style={styles.formGrid}>
          <label style={styles.label}>
            Timer name
            <input
              style={styles.input}
              value={timerName}
              onChange={(e) => setTimerName(e.target.value)}
              placeholder="e.g., Black Friday Sale"
            />
          </label>

          <div style={styles.row}>
            <label style={{ ...styles.label, flex: 1 }}>
              Start date
              <input
                type="date"
                style={styles.input}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label style={{ ...styles.label, flex: 1 }}>
              Start time
              <input
                type="time"
                style={styles.input}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </label>
          </div>

          <div style={styles.row}>
            <label style={{ ...styles.label, flex: 1 }}>
              End date
              <input
                type="date"
                style={styles.input}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
            <label style={{ ...styles.label, flex: 1 }}>
              End time
              <input
                type="time"
                style={styles.input}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </label>
          </div>

          <label style={styles.label}>
            Promotion description
            <textarea
              rows={3}
              style={styles.textarea}
              value={promotionDesc}
              onChange={(e) => setPromotionDesc(e.target.value)}
              placeholder="Describe the offer..."
            />
          </label>

          <div style={{ margin: "8px 0 4px", fontWeight: 600 }}>Color (HSB)</div>
          <div style={styles.row}>
            <label style={{ ...styles.label, flex: 1 }}>
              Hue
              <input
                type="range"
                min="0"
                max="360"
                value={hsb.hue}
                onChange={(e) => setHsb({ ...hsb, hue: Number(e.target.value) })}
                style={styles.range}
              />
            </label>
            <label style={{ ...styles.label, flex: 1 }}>
              Saturation
              <input
                type="range"
                min="0"
                max="100"
                value={hsb.saturation}
                onChange={(e) => setHsb({ ...hsb, saturation: Number(e.target.value) })}
                style={styles.range}
              />
            </label>
            <label style={{ ...styles.label, flex: 1 }}>
              Brightness
              <input
                type="range"
                min="0"
                max="100"
                value={hsb.brightness}
                onChange={(e) => setHsb({ ...hsb, brightness: Number(e.target.value) })}
                style={styles.range}
              />
            </label>
          </div>

          <div style={styles.row}>
            <label style={{ ...styles.label, flex: 1 }}>
              Timer size
              <select
                style={styles.input}
                value={timerSize}
                onChange={(e) => setTimerSize(e.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </label>
            <label style={{ ...styles.label, flex: 1 }}>
              Timer position
              <select
                style={styles.input}
                value={timerPosition}
                onChange={(e) => setTimerPosition(e.target.value)}
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </label>
          </div>

          <label style={styles.label}>
            Urgency notification
            <select
              style={styles.input}
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
            >
              <option value="none">None</option>
              <option value="colorPulse">Color pulse</option>
              <option value="notificationBanner">Notification banner</option>
            </select>
          </label>
        </div>
      </Modal>
    </div>
  );
}

/* ---- basic inline styles for demo ---- */
const styles = {
  page: { padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" },
  list: { listStyle: "none", margin: 0, padding: 0 },
  listItem: { padding: 16, borderBottom: "1px solid #f1f5f9" },
  button: {
    padding: "8px 12px",
    background: "#e5e7eb",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    cursor: "pointer",
  },
  primary: { background: "#111827", color: "#fff", borderColor: "#111827" },
  backdrop: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50
  },
  modal: { width: 720, maxWidth: "95vw", background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.25)" },
  modalHeader: { padding: 16, borderBottom: "1px solid #eee" },
  modalBody: { padding: 16 },
  modalFooter: { padding: 12, borderTop: "1px solid #eee", display: "flex", justifyContent: "flex-end", gap: 8 },
  formGrid: { display: "block" },
  row: { display: "flex", gap: 12 },
  label: { display: "block", fontWeight: 600, fontSize: 14, marginBottom: 8 },
  input: { width: "100%", marginTop: 6, padding: "8px 10px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14 },
  textarea: { width: "100%", marginTop: 6, padding: "8px 10px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14, resize: "vertical" },
  range: { width: "100%", marginTop: 12 },
};

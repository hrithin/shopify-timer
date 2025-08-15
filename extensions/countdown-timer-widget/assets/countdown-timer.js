import {  render } from "preact";
import { useState, useEffect } from "preact/hooks";

function CountdownTimer({ storeDomain }) {
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    fetch(`https://shopify-timer.onrender.com/api/timers/${storeDomain}`)
      .then(res => res.json())
      .then(data => {
        const now = new Date();
        // Pick first active timer
        const active = data.find(t => new Date(t.startTime) <= now && new Date(t.endTime) > now);
        if (active) {
          setTimer(active);
          updateCountdown(active.endTime);
          const interval = setInterval(() => updateCountdown(active.endTime), 1000);
          return () => clearInterval(interval);
        }
      })
      .catch(console.error);
  }, [storeDomain]);

  function updateCountdown(endTime) {
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) {
      setTimeLeft({ h: 0, m: 0, s: 0 });
      return;
    }
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    setTimeLeft({ h, m, s });
  }

  if (!timer || !timeLeft) return null;

  // Urgency styling
 
  let urgencyClass = "";
  if (timer.urgency?.enabled) {
    if (timer.urgency.type === "colorPulse") {
      urgencyClass = "ct-color-pulse";
    }
    if (timer.urgency.type === "notificationBanner") {
      urgencyClass = "ct-banner";
    }
  }

  return (
    <div
      className={`countdown-timer ${urgencyClass}`}
      style={{
        backgroundColor: timer.displayOptions?.color || "#000",
        color: "#fff",
        fontSize: timer.displayOptions?.size === "large" ? "1.5em" :
                  timer.displayOptions?.size === "small" ? "0.85em" : "1em",
        padding: "10px",
        textAlign: "center",
        position: "relative"
      }}
    >
      <div style={{ fontWeight: "bold" }}>{timer.promotionText}</div>
      <div>
        {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
      </div>

      <style>
        {`
          .ct-color-pulse {
            animation: pulse 1s infinite;
          }
          @keyframes pulse {
            0% { background-color: ${timer.displayOptions?.color || "#000"}; }
            50% { background-color: #ff4d4f; }
            100% { background-color: ${timer.displayOptions?.color || "#000"}; }
          }
          .ct-banner {
            border-top: 3px solid #ff4d4f;
            border-bottom: 3px solid #ff4d4f;
          }
        `}
      </style>
    </div>
  );
}

const rootEl = document.getElementById("countdown-timer-root");
if (rootEl) {
  const storeDomain = rootEl.getAttribute("data-store-domain");
  render(<CountdownTimer storeDomain={storeDomain} />, rootEl);
}

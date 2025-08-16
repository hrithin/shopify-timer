const API_BASE_URL = "https://shopify-timer.onrender.com/api/timers";

document.addEventListener("DOMContentLoaded", function () {
  const shopDomain = window.shopDomain || '';
  const container = document.getElementById('timer-widget-container');
  if (!container || !shopDomain) return;

  // Parse the timer end date
  function getEndDate(timer) {
    if (typeof timer.endTime === 'string' || timer.endTime instanceof Date) {
      return new Date(timer.endTime);
    }
    return null;
  }

  // Start the countdown
  function startCountdown(timer) {
    let intervalId;
    function update() {
      const now = new Date();
      const target = getEndDate(timer);

      if (!target || isNaN(target.getTime())) {
        container.innerHTML = "<p>Invalid timer end time!</p>";
        clearInterval(intervalId);
        return;
      }

      const distance = target - now;
      if (distance <= 0) {
        container.innerHTML = "<p>Timer ended!</p>";
        clearInterval(intervalId);
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const color = (timer.displayOptions && timer.displayOptions.color) || "#d49600";
      const promo = timer.promotionText || "Countdown";

      container.innerHTML =
        `<div style="color:${color};font-weight:bold;font-size:20px;">
          ${promo}: ${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}
        </div>`;
    }

    update();
    intervalId = setInterval(update, 1000);
  }

  // Fetch timer from API
  function fetchTimer() {
    fetch(`${API_BASE_URL}/${shopDomain}`)
      .then(res => res.json())
      .then(timers => {
        console.log("Timers received:", timers);
        if (Array.isArray(timers) && timers.length && timers[0].endTime) {
          startCountdown(timers[0]); // Pass the first timer object
        } else {
          container.innerHTML = "<p>No active timer.</p>";
        }
      })
      .catch((err) => {
        container.innerHTML = "<p>Could not load timer.</p>";
        console.error("API error:", err);
      });
  }

  fetchTimer();
});

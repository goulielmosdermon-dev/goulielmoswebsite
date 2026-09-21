// Completed-view counter. Visit any page once with ?stats=YOUR_KEY to unlock the counts on this device.
(function () {
  let key = null;
  try {
    const q = new URLSearchParams(location.search).get("stats");
    if (q === "off") localStorage.removeItem("statsKey");
    else if (q) localStorage.setItem("statsKey", q);
    key = localStorage.getItem("statsKey");
  } catch (e) {}

  // Called by film pages when the progress bar reaches the end. Owner's own views don't count.
  window.recordWatched = function (film) {
    if (key) return;
    fetch("/api/watch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ film }), keepalive: true }).catch(() => {});
  };

  if (!key) return;
  fetch("/api/watch?key=" + encodeURIComponent(key)).then(r => r.ok ? r.json() : null).then(counts => {
    if (!counts) return;
    const label = n => `watched ${n}×`;
    document.querySelectorAll("[data-film]").forEach(el => {
      const n = counts[el.dataset.film];
      if (n === undefined) return;
      const b = document.createElement("span");
      b.className = "watched";
      b.textContent = label(n);
      el.appendChild(b);
    });
  }).catch(() => {});
})();

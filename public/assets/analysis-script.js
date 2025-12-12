 document.getElementById("yearA").textContent = new Date().getFullYear();

function getQueryParam(name) {
  const s = new URLSearchParams(window.location.search);
  return s.get(name);
}

const ticker = (getQueryParam("symbol") || "").toUpperCase();

if (!ticker) {
  document.getElementById("loading").textContent = "No stock symbol provided.";
} else {
  document.getElementById("title").textContent = "Analysis: " + ticker;
  fetchAnalysis(ticker);
}

async function fetchAnalysis(ticker) {
  const loading = document.getElementById("loading");
  const full = document.getElementById("fullResult");

  loading.textContent = "Fetching analysis…";

  try {
    // 🔥 Correct Cloudflare Pages Function route
    const res = await fetch(`/api/analyze?symbol=${encodeURIComponent(ticker)}`);

    if (!res.ok) {
      const txt = await res.text();
      loading.textContent = "Error: " + res.status + " " + txt;
      return;
    }

    const data = await res.json();

    renderFull({
      overview: data.overview,
      growth: data.growth,
      ratios: data.ratios,
      risk: data.risk,
    });

    loading.style.display = "none";

  } catch (err) {
    loading.textContent = "Network error: " + err.message;
  }
}

function renderFull(obj) {
  const full = document.getElementById("fullResult");
  full.innerHTML = "";

  const addCard = (title, content) => {
    const c = document.createElement("div");
    c.className = "card";
    c.style.marginBottom = "16px";
    c.innerHTML =
      "<h3>" + escapeHtml(title) + "</h3>" +
      "<div class='muted'>" + escapeHtml(content) + "</div>";
    full.appendChild(c);
  };

  if (obj.overview) addCard("Overview", obj.overview);
  if (obj.growth) addCard("Growth & Profitability", obj.growth);
  if (obj.ratios) addCard("Key Ratios", obj.ratios);
  if (obj.risk) addCard("Risk Meter", obj.risk);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  })[c]);
}

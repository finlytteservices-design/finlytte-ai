 const params = new URLSearchParams(window.location.search);
const stock = params.get("stock");

document.getElementById("stockTitle").innerText = `Analysis for ${stock}`;

async function fetchAnalysis() {
  const res = await fetch(`/functions/analyze?stock=${encodeURIComponent(stock)}`);
  const data = await res.json();

  document.getElementById("overview").innerHTML = `<h2>Overview</h2>${data.overview}`;
  document.getElementById("growth").innerHTML = `<h2>Growth & Profitability</h2>${data.growth}`;
  document.getElementById("ratios").innerHTML = `<h2>Key Ratios</h2>${data.ratios}`;
  document.getElementById("roi").innerHTML = `<h2>ROI Analysis</h2>${data.roi}`;
  document.getElementById("industry").innerHTML = `<h2>Industry Comparison</h2>${data.industry}`;

  // Risk meter 0 = low, 90 = medium, 180 = high
  document.querySelector(".needle").style.transform = `rotate(${data.risk}deg)`;
}

fetchAnalysis();


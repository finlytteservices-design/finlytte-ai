 function analyze() {
  const symbol = document.getElementById("symbolInput").value.trim();

  if (!symbol) return alert("Enter symbol");

  document.getElementById("output").innerHTML = "<p>Loading...</p>";

  fetch(`/analyze?symbol=${symbol}`)
    .then((r) => r.json())
    .then((data) => render(data, symbol))
    .catch((err) => {
      document.getElementById("output").innerHTML = "Error loading data.";
      console.error(err);
    });
}

function render(data, symbol) {
  const out = document.getElementById("output");

  let priceSection = "";

  function makePriceCard(name, d) {
    if (!d) return "";

    const change = d.regularMarketChange || 0;
    const pct = d.regularMarketChangePercent || 0;
    const color = change >= 0 ? "green" : "red";

    return `
      <div class="stock-block">
        <h2>${name}</h2>
        <p><b>Price:</b> ₹${d.regularMarketPrice}</p>
        <p><b>52W High:</b> ₹${d.fiftyTwoWeekHigh}</p>
        <p><b>52W Low:</b> ₹${d.fiftyTwoWeekLow}</p>
        <p><b>Market Cap:</b> ${formatMC(d.marketCap)}</p>
        <p class="${color}">
          <b>Change:</b> ${change.toFixed(2)} (${pct.toFixed(2)}%)
        </p>
      </div>
    `;
  }

  priceSection += makePriceCard("NSE", data.nse);
  priceSection += makePriceCard("BSE", data.bse);

  out.innerHTML = `
    <h1>${symbol.toUpperCase()}</h1>

    <h2>AI Stock Analysis</h2>
    <div class="stock-block">${data.analysis.replace(/\n/g, "<br>")}</div>

    <h2>Market Data</h2>
    ${priceSection}
  `;
}

function formatMC(n) {
  if (!n) return "N/A";
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e7) return (n / 1e7).toFixed(2) + "Cr";
  return n;
}

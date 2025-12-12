function startAnalysis() {
    const symbol = document.getElementById("stockInput").value.trim();
    const exchange = document.getElementById("exchangeInput").value;

    if (!symbol) {
        alert("Enter a stock symbol");
        return;
    }

    // Redirect to analysis page with URL parameters
    window.location.href = `analysis.html?symbol=${encodeURIComponent(symbol)}&exchange=${exchange}`;
}


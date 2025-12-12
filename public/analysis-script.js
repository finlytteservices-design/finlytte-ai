const params = new URLSearchParams(window.location.search);
const symbol = params.get("symbol");
const exchange = params.get("exchange");

document.getElementById("reportTitle").innerText = `${symbol} (${exchange}) — Analysis Report`;

fetch(`/functions/analyze?symbol=${symbol}&exchange=${exchange}`)
    .then(res => res.json())
    .then(data => {
        document.getElementById("loading").style.display = "none";
        const out = document.getElementById("analysisOutput");
        out.style.display = "block";
        out.textContent = data.analysis;
    })
    .catch(err => {
        document.getElementById("loading").innerText = "Error fetching analysis.";
    });


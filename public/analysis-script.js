 const params = new URLSearchParams(window.location.search);
const stock = params.get("stock");

document.getElementById("stockTitle").innerText = `Analysis for ${stock}`;

async function loadAnalysis() {
    try {
        const res = await fetch(`/functions/analyze?stock=${encodeURIComponent(stock)}`);
        const data = await res.json();

        document.getElementById("overview").innerHTML = `<h2>Overview</h2><p>${data.overview}</p>`;
        document.getElementById("growth").innerHTML = `<h2>Growth & Profitability</h2><p>${data.growth}</p>`;
        document.getElementById("ratios").innerHTML = `<h2>Ratio Analysis</h2><p>${data.ratios}</p>`;
        document.getElementById("roi").innerHTML = `<h2>ROI Analysis</h2><p>${data.roi}</p>`;
        document.getElementById("industry").innerHTML = `<h2>Industry Comparison</h2><p>${data.industry}</p>`;

        drawRiskGauge(data.risk);

    } catch (err) {
        console.log(err);
    }
}

loadAnalysis();

/* RISK GAUGE */
function drawRiskGauge(value) {
    const canvas = document.getElementById("riskGauge");
    const ctx = canvas.getContext("2d");

    canvas.width = 400;
    canvas.height = 200;

    const centerX = canvas.width / 2;
    const centerY = canvas.height;
    const radius = 160;

    ctx.lineWidth = 16;

    // grey background arc
    ctx.strokeStyle = "#ddd";
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 0);
    ctx.stroke();

    // red indicator
    ctx.strokeStyle = "#e63946";
    ctx.beginPath();
    const angle = Math.PI + (value / 100) * Math.PI;
    ctx.arc(centerX, centerY, radius, Math.PI, angle);
    ctx.stroke();
}


 window.onload = async function () {
    const url = new URL(window.location.href);
    const stock = url.searchParams.get("stock");

    document.getElementById("stockTitle").innerText = `Analysis for ${stock}`;

    const res = await fetch(`/functions/analyze?stock=${encodeURIComponent(stock)}`);
    const data = await res.json();

    document.getElementById("overview").innerHTML = `<h2>Overview</h2>${data.overview}`;
    document.getElementById("growth").innerHTML = `<h2>Growth & Profitability</h2>${data.growth}`;
    document.getElementById("ratios").innerHTML = `<h2>Ratio Analysis</h2>${data.ratios}`;
    document.getElementById("roi").innerHTML = `<h2>ROI Analysis</h2>${data.roi}`;
    document.getElementById("industry").innerHTML = `<h2>Industry Comparison</h2>${data.industry}`;

    // Animate risk needle (-90° low → 0° medium → +90° high)
    const risk = Number(data.risk);
    const degree = (risk - 50) * 1.8; 
    document.getElementById("needle").style.transform = `rotate(${degree}deg)`;
};


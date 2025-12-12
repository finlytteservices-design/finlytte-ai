 function goToAnalysis() {
    const stock = document.getElementById("stockInput").value.trim();
    if (!stock) return alert("Enter a stock name");

    window.location.href = `analysis.html?stock=${encodeURIComponent(stock)}`;
}

async function loadAnalysis() {
    const params = new URLSearchParams(window.location.search);
    const stock = params.get("stock");

    document.getElementById("analysisTitle").textContent = `Analysis: ${stock}`;

    try {
        const res = await fetch(`/analysis/${stock}`);
        const data = await res.json();

        document.querySelector("#overview p").textContent = data.overview;
        document.querySelector("#growth p").textContent = data.growth;
        document.querySelector("#ratios p").textContent = data.ratios;
        document.querySelector("#roi p").textContent = data.roi;
        document.querySelector("#industry p").textContent = data.industry;

    } catch (err) {
        document.getElementById("error").textContent = 
            "Error: Could not fetch analysis.";
    }
}

if (window.location.pathname.includes("analysis.html")) {
    loadAnalysis();
}


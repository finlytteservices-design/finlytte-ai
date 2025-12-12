 const params = new URLSearchParams(window.location.search);
const stock = params.get("stock");
const exchange = params.get("exchange");

document.getElementById("title").textContent = `Analysis: ${stock} (${exchange})`;

async function loadAnalysis() {
    try {
        const res = await fetch(`/analyze?stock=${encodeURIComponent(stock)}&exchange=${exchange}`);

        const data = await res.json();

        document.getElementById("result").textContent =
            data.analysis || "No analysis available.";
    } catch (error) {
        document.getElementById("result").textContent = "Error fetching analysis.";
    }
}

loadAnalysis();


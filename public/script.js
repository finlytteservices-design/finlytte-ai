 
function analyzeStock() {
    const stock = document.getElementById("stockInput").value.trim();
    const exchange = document.getElementById("exchange").value;

    if (!stock) {
        alert("Enter a stock name.");
        return;
    }

    const query = new URLSearchParams({
        stock: stock,
        exchange: exchange
    });

    window.location.href = "/analysis.html?" + query.toString();
}

 // functions/analyze.js
export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const symbol = (url.searchParams.get("symbol") || "").toUpperCase();
    const exchange = (url.searchParams.get("exchange") || "NSE").toUpperCase();

    if (!symbol) {
      return new Response(JSON.stringify({ error: "No symbol provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // === Dummy structured response ===
    // Replace this block with real data fetching & analysis later.
    const result = {
      symbol,
      exchange,
      overview: `${symbol} is a major company listed on ${exchange}. Incorporated long ago, it operates in its sector with large market cap and strong presence.`,
      founded: "1990",
      ipoYear: "1998",
      industry: "Finance / Banking / Industrial",
      growthAndProfitability: `Over the past 5 years ${symbol} has shown steady revenue growth and healthy margins. Profitability ratios indicate a solid ROE and improving operating margins.`,
      price: {
        last: "₹1,234.56",
        change: "+1.8%",
        "52wHigh": "₹1,450.00",
        "52wLow": "₹900.00"
      },
      ratios: {
        ROCE: 18.5,
        ROE: 16.2,
        DebtEquity: 0.6,
        InventoryTurnover: 8.3,
        CurrentRatio: 1.4,
        PE: 22.5
      },
      ratioNotes: {
        ROCE: "ROCE > 15% indicates efficient capital allocation.",
        ROE: "ROE around 15-20% is strong for this sector.",
        DebtEquity: "Debt/Equity ~0.6 indicates moderate leverage.",
        InventoryTurnover: "Higher turnover is good; indicates healthy sales vs stock."
      },
      riskScore: 32, // 0 (low) - 100 (high)
      summary: `This is a test analysis for ${symbol} on ${exchange}. Replace with real analysis logic.`,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}


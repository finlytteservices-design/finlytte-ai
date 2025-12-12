 // functions/analyze.js
export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const symbol = (url.searchParams.get("symbol") || "").trim().toUpperCase();
    const exchange = (url.searchParams.get("exchange") || "NSE").toUpperCase();

    if (!symbol) {
      return new Response(JSON.stringify({ error: "No symbol provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ---- Dummy sample response (replace with real data fetch / AI later) ----
    // The API returns the fields the frontend expects
    const result = {
      symbol,
      exchange,
      overview: {
        founded: "1994",
        ipoYear: "1998",
        description:
          `${symbol} is a major company listed on ${exchange}. The company is one of the sector leaders in India with diversified operations and a long history of growth.`,
        notable: [
          "Large market capitalization",
          "Strong brand recognition",
          "Leading market share in core segments"
        ],
      },
      growth: {
        recentCAGR: "12%",
        revenueTrend: "Revenue has grown steadily over the last 5 years driven by volume expansion and margin improvement.",
        futureOutlook: "Moderate-to-strong growth expected if macro demand holds. Key drivers: capacity expansion and exports.",
      },
      ratios: {
        ROCE: 18.5,
        GrossProfitMargin: 28.2,
        ROA: 8.1,
        CurrentRatio: 1.4,
        DebtEquity: 0.45
      },
      roi: {
        trailing3Y: "35%",
        explanation: "ROIs reflect underlying profitability and share price appreciation; compare with peers for signal."
      },
      industryComparison: [
        { name: "Peer A", metric: "ROCE 15.2" },
        { name: "Peer B", metric: "ROCE 12.5" },
        { name: "Industry Avg", metric: "ROCE 13.8" }
      ],
      riskScore: 38, // 0 low risk .. 100 high risk
      generatedAt: new Date().toISOString()
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


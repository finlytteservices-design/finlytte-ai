 export async function onRequestGet(context) {
  const { request } = context;

  // Extract ?symbol=
  const url = new URL(request.url);
  const symbol = (url.searchParams.get("symbol") || "").toUpperCase();

  if (!symbol) {
    return new Response(JSON.stringify({ error: "No symbol provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // TEMPORARY STATIC ANALYSIS — replace later with real data
    const mockData = {
      overview: `${symbol} is a publicly traded company known for its market presence and operational scale.`,
      growth: `${symbol}'s revenue, profitability, and future expansion potential show mixed but stable performance.`,
      ratios: `Key financial ratios (P/E, ROE, ROCE, Debt-to-Equity) indicate moderate valuation for ${symbol}.`,
      risk: `Risk meter: Moderate — based on volatility, sector environment, and financial stability.`,
    };

    return new Response(JSON.stringify(mockData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Server error", details: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

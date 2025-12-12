 export async function onRequest(context) {
    const url = new URL(context.request.url);
    const stock = url.searchParams.get("stock");

    return Response.json({
        overview: `Overview for ${stock}. IPO year, business history, and its position among leading companies in India.`,
        growth: `Growth, profitability trends, financial momentum and future potential for ${stock}.`,
        ratios: `${stock} key investment ratios: ROCE, Gross Profit Ratio, Net Profit Margin, Debt/Equity, and Cash Flow Strength.`,
        roi: `ROI interpretation for ${stock}. What the return metrics imply for long-term investment.`,
        industry: `Industry comparison for ${stock} against major competitors and benchmarks.`,
        risk: Math.floor(Math.random() * 100)  // ← dynamic risk meter
    });
}


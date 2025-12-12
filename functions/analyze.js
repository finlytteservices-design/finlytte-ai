 export async function onRequestGet(context) {
    const url = new URL(context.request.url);
    const stock = url.searchParams.get("stock") || "Unknown";

    const response = {
        overview: `${stock} — IPO history, business model, and leadership overview.`,
        growth: `${stock}'s growth trend, profitability trajectory, and long-term future outlook.`,
        ratios: `ROCE, Gross Profit Ratio, Net Margin, Debt-Equity, and other key investment ratios for ${stock}.`,
        roi: `ROI interpretation for long-term investors of ${stock}.`,
        industry: `Industry comparison showing ${stock} vs major competitors.`,
        risk: Math.floor(Math.random() * 100)
    };

    return Response.json(response);
}


 export async function onRequest(context) {
  const stock = context.request.query.get("stock") || "Unknown";

  return Response.json({
    overview: `${stock} is a major player... (example structured overview).`,
    growth: `Growth analysis for ${stock}: profitability, revenue trends...`,
    ratios: `ROCE: 17%, GPR: 43%, 5 key ratios...`,
    roi: `ROI interpretation for ${stock}...`,
    industry: `${stock} compared to industry peers...`,
    risk: Math.floor(Math.random() * 181)  // 0–180 degrees
  });
}


 export async function onRequest(context) {
    const stock = context.params.stock;

    return Response.json({
        overview: `Overview for ${stock}.`,
        growth: `Growth & profitability analysis for ${stock}.`,
        ratios: `Important financial ratios for ${stock}.`,
        roi: `ROI analysis for ${stock}.`,
        industry: `Industry comparison for ${stock}.`,
        risk: 45
    });
}


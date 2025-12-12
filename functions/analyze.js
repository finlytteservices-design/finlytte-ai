 export async function onRequest(context) {
    try {
        const url = new URL(context.request.url);
        const stock = url.searchParams.get("stock");
        const exchange = url.searchParams.get("exchange");

        if (!stock || !exchange) {
            return new Response(
                JSON.stringify({ error: "Missing parameters" }),
                { headers: { "Content-Type": "application/json" } }
            );
        }

        // SAMPLE ANALYSIS — replace with real API later
        const analysis = `
Stock: ${stock}
Exchange: ${exchange}

• Strong financials
• Good long-term growth
• Valuation moderate
• Low debt
        `.trim();

        return new Response(
            JSON.stringify({ analysis }),
            { headers: { "Content-Type": "application/json" } }
        );

    } catch (err) {
        return new Response(
            JSON.stringify({ error: "Server error" }),
            { headers: { "Content-Type": "application/json" } }
        );
    }
}


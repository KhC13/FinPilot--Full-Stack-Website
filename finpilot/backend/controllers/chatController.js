const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function chat(req, res) {
  const { messages, financialContext } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({
      error: "Messages array is required.",
    });
  }

  const contextBlock = financialContext
    ? `
The user's financial profile:

Monthly Income: ₹${financialContext.income?.toLocaleString("en-IN") || "Unknown"}
Monthly Expenses: ₹${financialContext.expenses?.toLocaleString("en-IN") || "Unknown"}
Current Savings: ₹${financialContext.savings?.toLocaleString("en-IN") || "Unknown"}
Total Debt: ₹${financialContext.debt?.toLocaleString("en-IN") || "Unknown"}
Financial Health Score: ${financialContext.score ?? "Unknown"}/100
`
    : "";

  const systemPrompt = `
You are FinPilot AI, an expert financial advisor for Indian users.

${contextBlock}

Rules:
- Give personalized financial advice.
- Use Indian financial products like SIP, PPF, NPS, ELSS, FD and Mutual Funds.
- Never guarantee profits.
- Explain risks clearly.
- Keep responses concise and easy to understand.
- End every answer with one actionable next step.
- If financial data is missing, politely ask for it.
`;

  try {
    const chatHistory = messages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const prompt = `${systemPrompt}

Conversation:

${chatHistory}

Assistant:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({
      reply: response.text,
    });

  } catch (err) {
    console.error("Gemini Error:", err);

    res.status(500).json({
      error: "AI advisor is unavailable right now.",
    });
  }
}

module.exports = { chat };
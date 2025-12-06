const { GoogleGenAI } = require('@google/genai');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) throw new Error('GEMINI_API_KEY not configured.');

// Create the Gemini client
const ai = new GoogleGenAI({ apiKey: API_KEY });


async function classifyText(text) {
  const prompt = `
Analyze the following message for scam likelihood.
Return a JSON object ONLY with these exact keys:
{
  "score": integer (0-100),
  "category": one of ["Phishing", "Financial Scam", "Lottery Fraud", "OTP Stealing", "Impersonation", "Legitimate"],
  "explanation": short string
}
Message:
${text}
`;

  try {
    const response = await ai.models.generateContent({                // using Gemini JSON mode
      model: "gemini-2.5-flash", 
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // Extract text safely
    let rawText =
      response.output_text ||
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      '';

    // Clean markdown code fences (```json ... ```)
    rawText = rawText.replace(/```json|```/g, '').trim();

    if (!rawText) {
      console.error("⚠️ Empty Gemini text output:", response);
      return {
        score: 50,
        category: "Phishing",
        explanation: "Empty or missing model output"
      };
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (jsonErr) {
      console.error("⚠️ JSON parse failed. Cleaned output:", rawText);
      return {
        score: 50,
        category: "Phishing",
        explanation: "Malformed JSON response"
      };
    }

    return {
      score: Number(parsed.score || 0),
      category: parsed.category || 'Legitimate',
      explanation: parsed.explanation || '',
    };
  } catch (err) {
    console.error('Gemini classification error:', err.message || err);
    return {
      score: 50,
      category: 'Phishing',
      explanation: 'Model call failed or returned invalid JSON',
    };
  }
}

module.exports = { classifyText };

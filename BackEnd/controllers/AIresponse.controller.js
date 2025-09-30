import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

const main = async (req, res) => {
  const gameName = req.body.gameName;
  const prompt = `
    You are an assistant that produces structured JSON summaries about video games.

Instructions:
1. Use the provided context below. 
2. If any field is missing, retrieve information online. 
3. If information cannot be found even after lookup, return null. 
4. Do not invent values. 
5. Lists (pros/cons) must have at most 6 items.
6. The "worth_playing" field must consider all available factors (time to beat, critic reviews, player sentiment, price, deals). 
7. Return JSON only, no extra text.

Schema:
{
  "title": "string",
  "developer": "string or null",
  "publisher": "string or null",
  "languages": {
    "supported": ["string"] or null,
    "main": "string or null"
  },
  "time_to_beat": {
    "main_story": { "min": number or null, "max": number or null },
    "extras": { "min": number or null, "max": number or null },
    "completionist": { "min": number or null, "max": number or null }
  },
  "critic_score": {
    "score": number or null,
    "summary": "string or null"
  },
  "player_sentiment": {
    "pros": ["string"] or null,
    "cons": ["string"] or null
  },
  "price": {
    "range": "string or null",
    "deals": "string or null"
  },
  "most_preferred_platform": {
    "platform": "string or null",
    "reason": "string or null"
  },
  "other_preferred_platforms": [
    { "platform": "string", "reason": "string" }
  ] or null,
  "not_recommended_platforms": [
    { "platform": "string", "reason": "string" }
  ] or null,
  "worth_playing": "string or null"
}

Context (from external sources and/or lookup):
[${gameName} + ANY RETRIEVED DATA HERE]

Return JSON only.
`;

  const groundingTool = {
    googleSearch: {},
  };

  const config = {
    tools: [groundingTool],
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    thinkingConfig: {
      thinkingBudget: 0,
    },
    temperature: 1,
    config: config,
  });
  console.log(response.text);
  res.send(response.text);
};

export { main };

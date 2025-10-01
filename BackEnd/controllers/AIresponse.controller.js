import { GoogleGenAI } from "@google/genai";
import { fetchIGDBGame } from "./controllers.js";
import { fetchRAWGGame } from "./controllers.js";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

const main = async (req, res,) => {
  const gameName = req.body.gameName;
  const igdbData = req.body.igdbData;
  const rawgData = req.body.rawgData;
  const prompt = `

 You are an assistant that produces structured JSON summaries about video games.

Rules:
1. Follow the schema exactly. Do not add or remove fields. 
2. Always use all provided context data exactly as given. 
3. If context is missing any fields, use Google Search to find the information. 
   - Specifically: time to beat, critic reviews, player sentiment, price, and current deals. 
   - Always attempt a search before returning null. 
4. If even after lookup data is unavailable, return null for that field. 
5. Do not guess, approximate, or assume. 
6. Lists (pros/cons) must have at most 6 items. 
7. Time to beat values must be integers in hours. 
8. Prices must be in USD with a $ prefix. 
9. Languages and platforms must use full names (e.g., “PlayStation 5” not “PS5”). 
10. If contradictory data is found, prefer official or authoritative sources. 
11. The "worth_playing" field must be one or two sentences, directly referencing critic scores, player sentiment, price/deals, and time to beat when available. 
12. Return valid JSON only. No extra text.

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
[${gameName} + ${igdbData} + ${rawgData} + ANY CONTEXT DATA HERE]

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

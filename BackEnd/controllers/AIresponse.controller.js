import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

const main = async(res, req) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
      temperature: 0.1,
  });
  console.log(response.text);
  res.send(response.text);
}

export { main };

const prompt = `You are given the name of a video game and some contextual data from online sources. 
If the provided data is incomplete, do not make up values. 
Instead, return null for any field where information is missing or unavailable, 
so that an external retrieval system can look it up online later. 

Summarize whether it is worth playing based on:
- Average time to beat (main story, extras, and completionist)
- Critical reception (numeric Metacritic/OpenCritic scores)
- Player sentiment (general pros/cons from online reviews and forums, up to 6 items each)
- Typical or recent price (include sales/deals if notable)
- Overall most preferred platform, other preferred platforms, and any not recommended platforms (with reasons)
- Game developer, publisher, and supported languages (with main language)

Return the result strictly as JSON in this structure.  
Use numeric values for hours and critic score.  
If any information is not available, return null.  
Only output valid JSON.

{
    "title": "[Game Title]",
    "developer": "[Developer name or null]",
    "publisher": "[Publisher name or null]",
    "languages": {
        "supported": ["[lang1]", "[lang2]", "..."] or null,
        "main": "[main language or null]"
    },
    "time_to_beat": {
        "main_story": { "min": [hours or null], "max": [hours or null] },
        "extras": { "min": [hours or null], "max": [hours or null] },
        "completionist": { "min": [hours or null], "max": [hours or null] }
    },
    "critic_score": {
        "score": [numeric value or null],
        "summary": "[short note on critical reception or null]"
    },
    "player_sentiment": {
        "pros": ["pro1", "pro2", "..."] or null,
        "cons": ["con1", "con2", "..."] or null
    },
    "price": {
        "range": "[price info or null]",
        "deals": "[notable discounts or null]"
    },
    "most_preferred_platform": {
        "platform": "[platform name or null]",
        "reason": "[reason why this platform is most recommended or null]"
    },
    "other_preferred_platforms": [
        {
            "platform": "[platform name]",
            "reason": "[reason why this platform is recommended]"
        }
    ] or null,
    "not_recommended_platforms": [
        {
            "platform": "[platform name]",
            "reason": "[reason why this platform is not recommended]"
        }
    ] or null,
    "worth_playing": "[1–2 sentence verdict or null]"
}
`;

import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: API Key comes strictly from environment as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a simple user mood input (e.g., "Blue", "I feel sad", "Coffee") 
 * into a descriptive music prompt for Stability AI.
 */
export const enhanceMoodPrompt = async (input: string, color?: string): Promise<string> => {
  try {
    const modelId = 'gemini-2.5-flash';
    const colorContext = color ? ` The associated color is ${color}.` : '';
    
    const prompt = `
      You are an expert music producer and sound designer. 
      Convert the following user mood/input into a high-quality audio generation prompt for a Text-to-Audio AI (specifically Stable Audio).
      
      User Input: "${input}"${colorContext}

      Rules:
      1. Output ONLY the prompt string. No explanations.
      2. Include Genre, Instruments, and Mood descriptors.
      3. Format example: "Genre: Lo-Fi Hip Hop | Instruments: Piano, Vinyl Crackle, Soft Drums | Vibe: Melancholic, Relaxing"
      4. Keep it under 40 words.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback if API fails
    return `Genre: Ambient | Mood: ${input}`;
  }
};

/**
 * Generates a prompt for the weekly mix based on all previous daily prompts.
 */
export const generateWeeklyMixPrompt = async (dailyPrompts: string[]): Promise<string> => {
  try {
     const modelId = 'gemini-2.5-flash';
     const combinedHistory = dailyPrompts.join('; ');
     
     const prompt = `
      Create a prompt for a 90-second "Weekly Mix" musical track that fuses the vibes of the following daily prompts:
      [${combinedHistory}]

      Rules:
      1. Create a cohesive blend of the genres mentioned.
      2. Output ONLY the prompt string.
      3. Focus on a progression or journey in the music.
      4. Format: "Genre: Experimental Fusion | Instruments: Synth, Orchestra, Drums | Vibe: Eclectic Journey"
     `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini Weekly Mix Error:", error);
    return "Genre: Electronic Fusion | Vibe: Eclectic, Journey";
  }
};
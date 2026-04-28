import { GoogleGenAI, Type } from "@google/genai";
import { BrandIdentity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });

const brandSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Professional and catchy brand name" },
    tagline: { type: Type.STRING, description: "A short, memorable tagline" },
    mission: { type: Type.STRING, description: "The brand's core mission" },
    vision: { type: Type.STRING, description: "Long-term vision for the brand" },
    values: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of 3-5 core values"
    },
    colors: {
      type: Type.OBJECT,
      description: "A precision-engineered color palette. Do NOT use generic gradients. Use professional color theory (analogous, triadic, or monochromatic) that aligns with the brand's psychological profile and vision context. Ensure high contrast (WCAG AA standards) for text overlays.",
      properties: {
        primary: { type: Type.STRING, description: "The core brand color (Hex). Must represent the primary emotional driver based on color psychology (e.g., Trust, Energy, Luxury)." },
        secondary: { type: Type.STRING, description: "A supporting color (Hex) that complements the primary using advanced color harmony (Split-Complementary or Triadic)." },
        accent: { type: Type.STRING, description: "A high-visibility accent (Hex) for calls to action, ensuring it pops against both background and primary." },
        background: { type: Type.STRING, description: "A tuned neutral base (Hex). Can be a tinted white/beige or a deep, rich midnight/charcoal for dark modes." },
        text: { type: Type.STRING, description: "Highly legible text color (Hex) specifically chosen to provide optimal contrast with the background color." }
      }
    },
    typography: {
      type: Type.OBJECT,
      properties: {
        heading: {
          type: Type.OBJECT,
          properties: {
            family: { type: Type.STRING, description: "Google Font name for headings" },
            source: { type: Type.STRING, description: "Import URL or 'Google Fonts'" }
          }
        },
        body: {
          type: Type.OBJECT,
          properties: {
            family: { type: Type.STRING, description: "Google Font name for body text" },
            source: { type: Type.STRING, description: "Import URL or 'Google Fonts'" }
          }
        }
      }
    },
    logo_description: { type: Type.STRING, description: "A detailed prompt for generating a logo" },
    tone: { type: Type.STRING, description: "Brand tone of voice (e.g., Professional, Playful)" },
    target_audience: { type: Type.STRING, description: "Who the brand is for" },
    category: { 
      type: Type.STRING, 
      description: "Match exactly one of: SaaS, Studio, Commerce, Brand, Bank, Portfolio, Tech" 
    },
    tailwind_config: { type: Type.STRING, description: "A JSON string of tailwind config extensions" }
  },
  required: ["name", "tagline", "mission", "vision", "values", "colors", "typography", "category", "tailwind_config"]
};

export async function validateApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey) return false;
  try {
    const tempAi = new GoogleGenAI({ apiKey });
    // Attempt a very small, non-billable request to check if the key is valid
    await tempAi.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "hi",
      config: { maxOutputTokens: 1 }
    });
    return true;
  } catch (error) {
    console.error("API Key Validation Failed:", error);
    return false;
  }
}

export async function generateBrandIdentity(
  aboutText: string, 
  options: {
    model: string;
    apiKey?: string;
    creativity: number;
    mood: string;
  }
): Promise<BrandIdentity> {
  const { model, apiKey, creativity, mood } = options;
  
  try {
    const client = apiKey ? new GoogleGenAI({ apiKey }) : ai;
    const response = await client.models.generateContent({
      model: model,
      contents: `You are a world-class brand strategist and creative director at a top-tier design agency (e.g., Pentagram, Collins). 
      Your task is to transform the following 'About Us' text into a comprehensive, high-end brand identity package that feels like it was designed by a master.

      Role: Executive Creative Director
      Target Mood: ${mood.toUpperCase()}
      Creativity Bias: ${creativity} (0=Logical/Precise, 1=Abstract/Avant-Garde)

      Design Philosophy:
      - Editorial Sophistication: Think high-fashion (e.g., Vogue), premium architecture (e.g., Dezeen), or boutique technology (e.g., Teenage Engineering).
      - Typography Core Archetypes (YOU MUST CHOOSE ONE OR SYNTHESIZE):
        1. "THE ARCHITECT": Synergy of strict brutalist headers (Syne, Archivo Black) with technical mono notes (JetBrains Mono).
        2. "THE HEIRLOOM": High-contrast editorial serifs (Playfair Display, Fraunces) with wide-tracked minimal sans (Outfit).
        3. "THE VISIONARY": Geometric precision (Space Grotesk) paired with ethereal, light-weight sans.
      - Rule: NEVER use standard 'Inter' or 'Roboto' unless as a tertiary functional note. Force extreme weight contrasts (e.g., Black header + Thin body).
      - Color Theory: Move beyond clichés. No "blue for tech". Use layered neutrals (e.g., charcoal, bone, clay) as a base, with a single, highly saturated 'Accent' for impact. Ensure all combinations meet WCAG contrast guidelines.

      Strategic Requirements:
      1. NAME: Short, distinct, and memorable. Avoid suffix-heavy patterns (e.g., -ly, -ify).
      2. COLORS: Create a balanced, high-precision palette using professional color theory. The 'primary' color must align with the brand's core values. The 'secondary' and 'accent' should use sophisticated harmonies. 'background' must be a refined, neutral canvas.
      3. PSYCHOLOGY: Every color choice must be justifiable through the lens of brand psychology and market positioning.
      4. MISSION/VISION: Elevate the user's input into professional, evocative statements that sound like a billion-dollar company.
      5. TAILWIND_CONFIG: Provide a valid JSON string that extends the theme with the chosen brand colors and font families.

      Input Data:
      ---
      ${aboutText}
      ---
      
      Output strictly in JSON format according to the schema provided.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: brandSchema,
        temperature: creativity
      }
    });

    return JSON.parse(response.text) as BrandIdentity;
  } catch (error: any) {
    if (error?.message?.includes('quota') || error?.message?.includes('429')) {
      throw new Error("AI_QUOTA_EXCEEDED: The strategic synthesis engine has reached its temporary limit. Please try again in 60 seconds.");
    }
    throw error;
  }
}

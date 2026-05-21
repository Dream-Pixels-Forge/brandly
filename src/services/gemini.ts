import { GoogleGenAI, Type } from "@google/genai";
import { BrandIdentity } from "../types";

function createClient(apiKey?: string) {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

const ai = createClient(process.env.VITE_GEMINI_API_KEY);

const brandSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Professional and catchy brand name in the same language as the user's input" },
    tagline: { type: Type.STRING, description: "A short, memorable tagline in the same language as the user's input" },
    mission: { type: Type.STRING, description: "The brand's core mission in the same language as the user's input" },
    vision: { type: Type.STRING, description: "Long-term vision for the brand in the same language as the user's input" },
    values: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of 3-5 core values in the same language as the user's input"
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
    color_roles: {
      type: Type.OBJECT,
      description: "Functional color role mapping — assign each hex from the palette to a specific role: action (CTAs, interactive elements), support (layout balance, section dividers), neutral (backgrounds, breathing space), feedback_success (positive indicators), feedback_error (error states), feedback_warning (caution states).",
      properties: {
        action: { type: Type.STRING, description: "Hex color for CTA buttons, interactive elements, and clickable components" },
        support: { type: Type.STRING, description: "Hex color for layout balance, section dividers, and structural elements" },
        neutral: { type: Type.STRING, description: "Hex color for backgrounds, negative space, and subtle surfaces" },
        feedback_success: { type: Type.STRING, description: "Hex color for success states, confirmations, and positive indicators" },
        feedback_error: { type: Type.STRING, description: "Hex color for error states, destructive actions, and alerts" },
        feedback_warning: { type: Type.STRING, description: "Hex color for caution states, warnings, and pending indicators" }
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
    logo_psychology: {
      type: Type.OBJECT,
      description: "Structured logo design rationale based on shape psychology and brand positioning",
      properties: {
        shape_archetype: { type: Type.STRING, description: "Geometric or Organic — the foundational shape language" },
        shape_meaning: { type: Type.STRING, description: "What this shape psychologically communicates: circles (unity/safety/community), squares (stability/trust/professionalism), triangles (action/energy/progress), hexagons (connection/efficiency), ovals (flow/calm/approachability), abstract (modern/open-ended/innovative), organic (natural/authentic)" },
        symbol_type: { type: Type.STRING, description: "Abstract mark, letterform, icon, combination mark, or emblem" },
        mark_style: { type: Type.STRING, description: "Style descriptor (e.g., Minimalist, Hand-drawn, Geometric, Gradient)" },
        rationale: { type: Type.STRING, description: "Psychology-based explanation of why this logo approach fits the brand" }
      }
    },
    tone: { type: Type.STRING, description: "Brand tone of voice in the same language as the user's input (e.g., Professionnel, Ludique in French; Profesional, Juguetón in Spanish)" },
    target_audience: { type: Type.STRING, description: "Who the brand is for, in the same language as the user's input" },
    category: { 
      type: Type.STRING, 
      description: "Match exactly one of: SaaS, Studio, Commerce, Brand, Bank, Portfolio, Tech" 
    },
    grid_spec: {
      type: Type.OBJECT,
      description: "Recommended layout grid system for the brand's visual identity",
      properties: {
        type: { type: Type.STRING, description: "Grid type (e.g., Modular, Column, Asymmetric, Golden Ratio, Manuscript, Hierarchical, Compound)" },
        columns: { type: Type.NUMBER, description: "Number of columns (typically 12 for web, 4-6 for print)" },
        gutter: { type: Type.STRING, description: "Gutter width between columns (e.g., 20px, 1rem)" },
        column_width: { type: Type.STRING, description: "Base column width (e.g., 80px, 60px, fluid)" },
        rationale: { type: Type.STRING, description: "Why this grid system fits the brand's category and visual personality" }
      }
    },
    logo_variants: {
      type: Type.OBJECT,
      description: "Logo variations for different contexts: horizontal (wide layouts), vertical (stacked/tall layouts), icon-only (favicon/avatar), monochrome (single-color printing)",
      properties: {
        horizontal: { type: Type.STRING, description: "Description of the horizontal logo layout — text + mark side by side. Suitable for headers, wide layouts." },
        vertical: { type: Type.STRING, description: "Description of the vertical logo layout — mark stacked above text. Suitable for square spaces, social media." },
        icon_only: { type: Type.STRING, description: "Description of the icon-only mark. Suitable for favicon, app icon, avatar." },
        monochrome: { type: Type.STRING, description: "Description of the single-color version. Suitable for black-and-white printing, embossing, stamps." }
      }
    },
    design_constraints: {
      type: Type.OBJECT,
      description: "Core design constraints that keep the brand system disciplined and recognizable",
      properties: {
        type_family_count: { type: Type.NUMBER, description: "Number of type families to use (recommend 1-2 for discipline)" },
        color_count: { type: Type.NUMBER, description: "Number of tonal colors per design (recommend 3 for consistency)" },
        accent_color: { type: Type.STRING, description: "The single vivid accent hex that carries emotional weight and contrast" },
        rationale: { type: Type.STRING, description: "Why these constraints serve the brand's personality and ensure consistency" }
      }
    },
    emotional_mapping: {
      type: Type.OBJECT,
      description: "Maps target emotions to specific design decisions across the four building blocks",
      properties: {
        target_emotions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 2-3 emotions the brand should evoke (e.g., excitement, trust, belonging)" },
        color_rationale: { type: Type.STRING, description: "How the color palette expresses the target emotions (e.g., red for excitement, blue for trust)" },
        typography_rationale: { type: Type.STRING, description: "How the type choices express the target emotions (e.g., bold sans for confidence, serif for sophistication)" },
        imagery_rationale: { type: Type.STRING, description: "How imagery style expresses the target emotions (e.g., high-contrast for energy, soft tones for calm)" },
        layout_rationale: { type: Type.STRING, description: "How layout/composition expresses the target emotions (e.g., asymmetric for dynamism, spacious for luxury)" }
      }
    },
    tailwind_config: { type: Type.STRING, description: "A JSON string of tailwind config extensions using semantic design tokens. Use a 3-layer token hierarchy: base tokens for raw values (color-charcoal-900), semantic tokens for purpose (color-bg-primary), and component tokens for specificity (btn-primary-bg)." }
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

export async function regenerateAspect(
  identity: BrandIdentity,
  aspect: 'colors' | 'typography' | 'name',
  aboutText: string,
  options: { model: string; apiKey?: string; creativity: number; mood: string }
): Promise<BrandIdentity> {
  const { model, apiKey, creativity, mood } = options;
  const client = apiKey ? new GoogleGenAI({ apiKey }) : ai;
  if (!client) throw new Error("Gemini API key not configured. Add it in Settings.");

  const aspectInstructions: Record<string, string> = {
    colors: `Regenerate ONLY the color palette (primary, secondary, accent, background, text).
Keep the brand name "${identity.name}", tagline, and everything else IDENTICAL.
Current colors: ${JSON.stringify(identity.colors)}.
Output the FULL brand schema with ONLY the colors changed.`,
    typography: `Regenerate ONLY the typography pairing (heading and body fonts).
Keep the brand name "${identity.name}", tagline, colors (${identity.colors.primary}), and everything else IDENTICAL.
Current typography: ${JSON.stringify(identity.typography)}.
Output the FULL brand schema with ONLY the typography changed.`,
    name: `Regenerate ONLY the brand name and tagline.
Keep the colors (${identity.colors.primary}), typography, and everything else IDENTICAL.
Current name: "${identity.name}", tagline: "${identity.tagline}".
Output the FULL brand schema with ONLY the name and tagline changed.`,
  };

  try {
    const response = await client.models.generateContent({
      model,
      contents: `You are a brand strategist refining an existing identity.

Target Mood: ${mood.toUpperCase()}
Creativity Bias: ${creativity}
Language: The user's original input is shown below. Your output must be in the SAME language as that input.

Task: ${aspectInstructions[aspect]}

The user's original input was:
---
${aboutText}
---

Output strictly in JSON format according to the schema provided. Keep ALL fields that are not being regenerated EXACTLY as they are.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: brandSchema,
        temperature: creativity,
      }
    });

    const parsed = JSON.parse(response.text) as BrandIdentity;
    // Deep merge: preserve nested optional fields Gemini might drop
    return {
      ...identity,
      ...parsed,
      colors: { ...identity.colors, ...parsed.colors },
      typography: { ...identity.typography, ...parsed.typography },
      color_roles: parsed.color_roles ? { ...(identity.color_roles || {}), ...parsed.color_roles } : identity.color_roles,
      logo_psychology: parsed.logo_psychology ? { ...(identity.logo_psychology || {}), ...parsed.logo_psychology } : identity.logo_psychology,
      grid_spec: parsed.grid_spec ? { ...(identity.grid_spec || {}), ...parsed.grid_spec } : identity.grid_spec,
      logo_variants: parsed.logo_variants ? { ...(identity.logo_variants || {}), ...parsed.logo_variants } : identity.logo_variants,
      design_constraints: parsed.design_constraints ? { ...(identity.design_constraints || {}), ...parsed.design_constraints } : identity.design_constraints,
      emotional_mapping: parsed.emotional_mapping ? { ...(identity.emotional_mapping || {}), ...parsed.emotional_mapping } : identity.emotional_mapping,
    } as BrandIdentity;
  } catch (error: any) {
    if (error?.message?.includes('quota') || error?.message?.includes('429')) {
      throw new Error("AI_QUOTA_EXCEEDED: The engine has reached its temporary limit. Please wait 60 seconds.");
    }
    throw error;
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
    if (!client) throw new Error("Gemini API key not configured. Add it in Settings.");
    const response = await client.models.generateContent({
      model: model,
      contents: `You are a world-class brand strategist and creative director at a top-tier design agency (e.g., Pentagram, Collins). 
      Your task is to transform the following 'About Us' text into a comprehensive, high-end brand identity package that feels like it was designed by a master.

      Role: Executive Creative Director
      Target Mood: ${mood.toUpperCase()}
      Creativity Bias: ${creativity} (0=Logical/Precise, 1=Abstract/Avant-Garde)
      Language: The entire output must be in the SAME language as the user's input text below. Detect the language from the input and generate all text fields (name, tagline, mission, vision, values, tone, target_audience) in that language.

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
       3. COLOR_ROLES: Map the palette hex values into functional roles — action (for CTAs), support (for layout balance), neutral (for backgrounds), and feedback states (success/error/warning). Each role must use one of the five palette colors.
       4. PSYCHOLOGY: Every color choice must be justifiable through the lens of brand psychology and market positioning.
       5. LOGO_PSYCHOLOGY: Define the logo direction using shape psychology. Include a 'shape_meaning' field that explains what the chosen shape communicates psychologically: circles symbolize unity/safety/community, squares convey stability/trust/professionalism, triangles signal action/energy/progress, hexagons imply connection/efficiency, ovals feel flow/calm/approachable, abstract feels modern/open-ended, organic feels natural/authentic.
       6. LOGO_VARIANTS: Generate 4 distinct logo variant descriptions — horizontal (mark + text side-by-side for headers), vertical (mark stacked above text for social), icon-only (simplified mark for favicon/avatar), monochrome (single-color version for print/stamps).
       7. DESIGN_CONSTRAINTS: Define a disciplined constraint system — recommend 1-2 type families, 3 tonal colors per design, and identify a single vivid accent hex that carries emotional weight. Explain how these constraints keep the brand recognizable.
       8. EMOTIONAL_MAPPING: Identify 2-3 target emotions the brand should evoke (excitement, trust, belonging, sophistication, etc.). Then map each of the 4 design building blocks (color, typography, imagery, layout) to these emotions — explain how each choice reinforces the emotional goal.
       9. GRID_SPEC: Recommend a grid system that fits the brand category (e.g., Modular for SaaS, Asymmetric for Studio, Golden Ratio for Bank). Include columns, gutter width, and rationale.
       10. MISSION/VISION: Elevate the user's input into professional, evocative statements that sound like a billion-dollar company.
       11. TAILWIND_CONFIG: Provide a valid JSON string that extends the theme with the chosen brand colors and font families. Use a 3-layer token hierarchy: base tokens (e.g., color-charcoal-900), semantic tokens (e.g., color-bg-primary), and component tokens (e.g., btn-primary-bg).

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

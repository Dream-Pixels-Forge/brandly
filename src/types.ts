export type BrandMood = 'minimal' | 'bold' | 'luxury' | 'tech' | 'warm';

export interface ColorRoles {
  action: string;
  support: string;
  neutral: string;
  feedback_success: string;
  feedback_error: string;
  feedback_warning: string;
}

export interface LogoPsychology {
  shape_archetype: string;
  shape_meaning: string;
  symbol_type: string;
  mark_style: string;
  rationale: string;
}

export interface LogoVariants {
  horizontal: string;
  vertical: string;
  icon_only: string;
  monochrome: string;
}

export interface DesignConstraints {
  type_family_count: number;
  color_count: number;
  accent_color: string;
  rationale: string;
}

export interface EmotionalMapping {
  target_emotions: string[];
  color_rationale: string;
  typography_rationale: string;
  imagery_rationale: string;
  layout_rationale: string;
}

export interface GridSpec {
  type: string;
  columns: number;
  gutter: string;
  column_width: string;
  rationale: string;
}

export interface BrandIdentity {
  name: string;
  tagline: string;
  mission: string;
  vision: string;
  values: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  color_roles?: ColorRoles;
  typography: {
    heading: {
      family: string;
      source: string;
    };
    body: {
      family: string;
      source: string;
    };
  };
  logo_description: string;
  logo_psychology?: LogoPsychology;
  tone: string;
  target_audience: string;
  category: 'SaaS' | 'Studio' | 'Commerce' | 'Brand' | 'Bank' | 'Portfolio' | 'Tech';
  grid_spec?: GridSpec;
  logo_variants?: LogoVariants;
  design_constraints?: DesignConstraints;
  emotional_mapping?: EmotionalMapping;
  tailwind_config: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: number;
}

export interface BrandProject {
  id: string;
  userId: string;
  input: string;
  identity: BrandIdentity;
  createdAt: any; // Can be number or Firebase Timestamp
}

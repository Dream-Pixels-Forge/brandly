export type BrandMood = 'minimal' | 'bold' | 'luxury' | 'tech' | 'warm';

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
  tone: string;
  target_audience: string;
  category: 'SaaS' | 'Studio' | 'Commerce' | 'Brand' | 'Bank' | 'Portfolio' | 'Tech';
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

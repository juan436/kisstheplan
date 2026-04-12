export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface Wedding {
  id: string;
  partner1Name: string;
  partner1Last?: string;
  partner1Role?: string;
  partner2Name: string;
  partner2Last?: string;
  partner2Role?: string;
  date: string;
  venue: string;
  location: string;
  estimatedGuests: number;
  estimatedBudget: number;
  currency?: string;
  timezone?: string;
  photoUrl?: string;
  slug: string;
  mealOptions?: string[];
  mealColors?: Record<string, string>;
  allergyOptions?: string[];
  allergyColors?: Record<string, string>;
  transportOptions?: string[];
}

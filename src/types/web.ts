export interface WebPageConfig {
  id: string;
  templateId: string;
  colorPalette: Record<string, string>;
  fontTitle: string;
  fontBody: string;
  rsvpEnabled: boolean;
  rsvpDeadline: string | null;
  mealOptions: string[];
  transportOptions: string[];
  heroTitle: string;
  heroSubtitle: string;
  storyText: string;
  scheduleText: string;
  locationText: string;
  transportText: string;
  accommodationText: string;
  dressCode: string;
  customSections: Array<{ title: string; content: string }>;
  isPublished: boolean;
  publishedAt: string | null;
}

export interface PublicWeddingData {
  wedding: {
    partner1Name: string;
    partner2Name: string;
    date: string;
    venue: string;
    location: string;
    slug: string;
  };
  page: Omit<WebPageConfig, "id" | "isPublished" | "publishedAt">;
}

export interface RsvpSubmission {
  guestName: string;
  rsvpStatus: "confirmed" | "rejected";
  mealChoice?: string;
  allergies?: string;
  transport?: boolean;
  transportPickupPoint?: string;
}

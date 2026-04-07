export interface WebPageConfig {
  id: string;
  templateId: string;
  colorPalette: Record<string, string>;
  fontTitle: string;
  fontBody: string;
  // Fotos
  heroImage?: string;
  galleryImages?: string[];
  // RSVP
  rsvpEnabled: boolean;
  rsvpDeadline: string | null;
  mealOptions: string[];
  transportOptions: string[];
  confirmMessage?: string;
  rejectMessage?: string;
  // Contenido
  heroTitle: string;
  heroSubtitle: string;
  storyTitle?: string;
  storyText: string;
  scheduleTitle?: string;
  scheduleText: string;
  locationTitle?: string;
  locationText: string;
  transportTitle?: string;
  transportText: string;
  accommodationTitle?: string;
  accommodationText: string;
  dressCodeTitle?: string;
  dressCode: string;
  customSections: Array<{ title: string; content: string }>;
  // Visibilidad
  visibleSections?: Record<string, boolean>;
  // Publicación
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

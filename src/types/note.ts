export type NoteType = 'text' | 'pdf' | 'moodboard';

export interface MoodboardColor {
  id: string;
  hexColor: string;
  name?: string;
  order: number;
}

export interface MoodboardImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

export interface MoodboardCategory {
  id: string;
  name: string;
  order: number;
  images: MoodboardImage[];
}

export interface Note {
  id: string;
  type: NoteType;
  title: string;
  vendorId?: string | null;
  content: string;
  colorPalette: MoodboardColor[];
  categories: MoodboardCategory[];
  createdAt: string;
  updatedAt: string;
}

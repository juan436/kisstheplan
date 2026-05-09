export interface GuestPublic {
  id: string;
  firstName: string;
  lastName: string;
  rsvpStatus: string;
  mealChoice?: string;
  allergies?: string;
  transport?: boolean;
  transportPickupPoint?: string;
  groupId?: string | null;
}

export interface RsvpSession {
  guest: GuestPublic;
  group: { id: string; members: GuestPublic[] } | null;
  wedding: {
    slug: string;
    mealOptions: string[];
    allergyOptions: string[];
    transportOptions: string[];
    confirmMessage: string;
    rejectMessage: string;
  };
  token: string;
}

export interface GuestResponse {
  guestId: string;
  rsvpStatus: "confirmed" | "rejected";
  mealChoice?: string;
  allergies?: string;
  transport?: boolean;
  transportPickupPoint?: string;
}

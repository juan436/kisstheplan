export interface Collaborator {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'revoked';
  acceptedAt: string | null;
}

export interface CollaboratorInviteInfo {
  email: string;
  status: 'pending' | 'accepted' | 'revoked';
  partner1Name: string;
  partner2Name: string;
}

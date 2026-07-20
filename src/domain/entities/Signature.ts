export interface Signature {
  id: string;
  userId: string;
  userName: string;
  signedAt: Date;
  reason?: string;
  city?: string;
  country?: string;
}

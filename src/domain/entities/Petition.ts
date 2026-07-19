export interface Petition {
  id: string;
  title: string;
  description: string;
  scale: string; // 'Ville' | 'National' | 'International'
  category: string; // e.g. 'Politique', 'Education', etc.
  imageUrl: string | null;
  createdBy: string;
  creatorName: string;
  createdAt: Date;
  signaturesCount: number;
  views: number;
  shares: number;
  signatureUserIds: string[];
  signatureNames: string[];
}

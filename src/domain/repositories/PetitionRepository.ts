import { Petition } from "../entities/Petition";

export interface PetitionRepository {
  createPetition(
    title: string,
    description: string,
    scale: string,
    category: string,
    creatorId: string,
    creatorName: string,
    imageFile?: File | null
  ): Promise<Petition>;
  getPetitionById(id: string): Promise<Petition | null>;
  getAllPetitions(category?: string, scale?: string): Promise<Petition[]>;
  getPetitionsByUserId(userId: string): Promise<Petition[]>;
  signPetition(petitionId: string, userId: string, userName: string): Promise<void>;
  incrementViews(petitionId: string): Promise<void>;
  incrementShares(petitionId: string): Promise<void>;

  /** Subscribe to real-time updates for a single petition document. */
  onPetitionSnapshot(
    id: string,
    callback: (petition: Petition | null) => void
  ): () => void;
}

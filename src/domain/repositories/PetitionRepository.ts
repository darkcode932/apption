import { Petition } from "../entities/Petition";
import { Comment } from "../entities/Comment";
import { TimelineEvent } from "../entities/TimelineEvent";

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

  /** Add a comment under a petition. */
  addComment(
    petitionId: string,
    userId: string,
    userName: string,
    text: string
  ): Promise<Comment>;

  /** Subscribe to comments updates for a single petition. */
  onCommentsSnapshot(
    petitionId: string,
    callback: (comments: Comment[]) => void
  ): () => void;

  /** Add an update or official statement to the petition timeline. */
  addTimelineEvent(
    petitionId: string,
    event: Omit<TimelineEvent, "id" | "createdAt">
  ): Promise<TimelineEvent>;

  /** Subscribe to real-time timeline events updates for a single petition. */
  onTimelineSnapshot(
    petitionId: string,
    callback: (events: TimelineEvent[]) => void
  ): () => void;

  /** Mark a petition as successful (victory). */
  declareVictory(petitionId: string): Promise<void>;
}

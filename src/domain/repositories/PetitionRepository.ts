import { Petition } from "../entities/Petition";
import { Comment } from "../entities/Comment";
import { TimelineEvent } from "../entities/TimelineEvent";
import { Signature } from "../entities/Signature";
import { Notification } from "../entities/Notification";
import { Donation } from "../entities/Donation";

export interface PetitionRepository {
  createPetition(
    title: string,
    description: string,
    scale: string,
    category: string,
    creatorId: string,
    creatorName: string,
    imageFile?: File | null,
    latitude?: number,
    longitude?: number,
    country?: string,
    city?: string
  ): Promise<Petition>;
  getPetitionById(id: string): Promise<Petition | null>;
  getAllPetitions(category?: string, scale?: string): Promise<Petition[]>;
  getPetitionsByUserId(userId: string): Promise<Petition[]>;
  
  /** Sign a petition and record a detailed signature record. */
  signPetition(
    petitionId: string,
    userId: string,
    userName: string,
    reason?: string,
    city?: string,
    country?: string
  ): Promise<void>;
  
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

  /** Get a list of detailed signatures for a petition. */
  getSignatures(petitionId: string): Promise<Signature[]>;

  /** Add a micro-donation for collaborative advertising boost. */
  addDonation(
    petitionId: string,
    userId: string,
    userName: string,
    amount: number,
    currency?: string
  ): Promise<Donation>;

  /** Fetch notifications for a user. */
  getUserNotifications(userId: string): Promise<Notification[]>;

  /** Mark a notification as read. */
  markNotificationRead(notificationId: string): Promise<void>;

  /** Moderation: delete a petition from Firestore (Admin / Super Admin only). */
  deletePetition(petitionId: string): Promise<void>;

  /** Moderation: toggle feature status for a petition (Admin / Super Admin only). */
  updatePetitionFeatured(petitionId: string, isFeatured: boolean): Promise<void>;

  /** Subscribe to real-time updates for signatories list. */
  onSignaturesSnapshot(
    petitionId: string,
    callback: (signatures: Signature[]) => void
  ): () => void;

  /** Subscribe to real-time notifications updates for a user. */
  onNotificationsSnapshot(
    userId: string,
    callback: (notifications: Notification[]) => void
  ): () => void;

  /** Create a notification document in the global notifications collection. */
  createNotification(
    userId: string,
    title: string,
    message: string,
    type: string,
    petitionId: string
  ): Promise<void>;
}

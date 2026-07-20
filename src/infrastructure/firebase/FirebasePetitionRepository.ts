import { PetitionRepository } from "../../domain/repositories/PetitionRepository";
import { Petition } from "../../domain/entities/Petition";
import { Comment } from "../../domain/entities/Comment";
import { TimelineEvent } from "../../domain/entities/TimelineEvent";
import { Signature } from "../../domain/entities/Signature";
import { Notification } from "../../domain/entities/Notification";
import { Donation } from "../../domain/entities/Donation";
import { db, storage } from "./firebaseConfig";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  arrayUnion,
  increment,
  Timestamp,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export class FirebasePetitionRepository implements PetitionRepository {
  private mapDocToPetition(id: string, data: any): Petition {
    let rawDate: Date;
    if (data.createdAt && typeof data.createdAt.toDate === "function") {
      rawDate = data.createdAt.toDate();
    } else if (data.createdAt) {
      rawDate = new Date(data.createdAt);
    } else {
      rawDate = new Date();
    }

    return {
      id,
      title: data.title || "",
      description: data.description || "",
      scale: data.scale || "National",
      category: data.category || "Autres...",
      imageUrl: data.imageUrl || null,
      createdBy: data.createdBy || "",
      creatorName: data.creatorName || "",
      createdAt: rawDate,
      signaturesCount: data.signaturesCount || 0,
      views: data.views || 0,
      shares: data.shares || 0,
      signatureUserIds: data.signatureUserIds || [],
      signatureNames: data.signatureNames || [],
      status: data.status || "active",
      latitude: data.latitude !== undefined ? data.latitude : 0,
      longitude: data.longitude !== undefined ? data.longitude : 0,
      country: data.country || "",
      city: data.city || "",
      isFeatured: !!data.isFeatured,
    };
  }

  async createPetition(
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
  ): Promise<Petition> {
    let imageUrl = "/assets/images/libération.jpg"; // default fallback

    if (imageFile) {
      try {
        const storageRef = ref(storage, `petitions/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (storageError) {
        console.warn("Firebase Storage failed, trying base64 fallback:", storageError);
        try {
          imageUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
          });
        } catch (base64Error) {
          console.error("Base64 conversion failed:", base64Error);
        }
      }
    }

    const petitionData = {
      title,
      description,
      scale,
      category,
      imageUrl,
      createdBy: creatorId,
      creatorName,
      createdAt: Timestamp.now(),
      signaturesCount: 1, // Creator counts as first signature
      views: 0,
      shares: 0,
      signatureUserIds: [creatorId],
      signatureNames: [creatorName],
      status: "active",
      latitude: latitude || 0,
      longitude: longitude || 0,
      country: country || "",
      city: city || "",
      isFeatured: false,
    };

    const docRef = await addDoc(collection(db, "petition"), petitionData);
    return this.mapDocToPetition(docRef.id, petitionData);
  }

  async getPetitionById(id: string): Promise<Petition | null> {
    const docSnap = await getDoc(doc(db, "petition", id));
    if (!docSnap.exists()) return null;
    return this.mapDocToPetition(docSnap.id, docSnap.data());
  }

  async getAllPetitions(category?: string, scale?: string): Promise<Petition[]> {
    const petitionCol = collection(db, "petition");
    let q = query(petitionCol, orderBy("createdAt", "desc"));

    if (category && scale) {
      q = query(petitionCol, where("category", "==", category), where("scale", "==", scale), orderBy("createdAt", "desc"));
    } else if (category) {
      q = query(petitionCol, where("category", "==", category), orderBy("createdAt", "desc"));
    } else if (scale) {
      q = query(petitionCol, where("scale", "==", scale), orderBy("createdAt", "desc"));
    }

    const snapshot = await getDocs(q);
    const petitions: Petition[] = [];
    snapshot.forEach((doc) => {
      petitions.push(this.mapDocToPetition(doc.id, doc.data()));
    });
    return petitions;
  }

  async getPetitionsByUserId(userId: string): Promise<Petition[]> {
    const petitionCol = collection(db, "petition");
    const q = query(petitionCol, where("createdBy", "==", userId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const petitions: Petition[] = [];
    snapshot.forEach((doc) => {
      petitions.push(this.mapDocToPetition(doc.id, doc.data()));
    });
    return petitions;
  }

  /**
   * Sign a petition using a Firestore transaction to prevent duplicate signatures.
   * Atomically records the signature inside the '/signatures' subcollection and increments the petition document count.
   * Dispatches milestone notifications to the creator atomically if thresholds are met.
   */
  async signPetition(
    petitionId: string,
    userId: string,
    userName: string,
    reason?: string,
    city?: string,
    country?: string
  ): Promise<void> {
    const docRef = doc(db, "petition", petitionId);

    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(docRef);
      if (!docSnap.exists()) {
        throw new Error("Cette pétition n'existe plus.");
      }

      const data = docSnap.data();
      const existingUserIds: string[] = data.signatureUserIds || [];

      if (existingUserIds.includes(userId)) {
        throw new Error("Vous avez déjà signé cette pétition.");
      }

      const nextCount = (data.signaturesCount || 0) + 1;

      // Add signature record to subcollection atomically
      const signatureDocRef = doc(collection(docRef, "signatures"));
      transaction.set(signatureDocRef, {
        userId,
        userName,
        signedAt: Timestamp.now(),
        reason: reason || "",
        city: city || "",
        country: country || "",
      });

      // Update parent petition arrays and counter
      transaction.update(docRef, {
        signatureUserIds: arrayUnion(userId),
        signatureNames: arrayUnion(userName),
        signaturesCount: increment(1),
      });

      // Dispatch signature milestone notification atomically
      const milestones = [5, 10, 20, 50, 100, 250, 500, 1000, 5000];
      if (milestones.includes(nextCount)) {
        const creatorId = data.createdBy;
        const notifDocRef = doc(collection(db, "notifications"));
        transaction.set(notifDocRef, {
          userId: creatorId,
          title: "Palier atteint ! 🚀",
          message: `Votre pétition "${data.title}" a recueilli ${nextCount} signatures !`,
          type: "milestone",
          petitionId: petitionId,
          read: false,
          createdAt: Timestamp.now(),
        });
      }
    });
  }

  async incrementViews(petitionId: string): Promise<void> {
    const docRef = doc(db, "petition", petitionId);
    await updateDoc(docRef, {
      views: increment(1),
    });
  }

  async incrementShares(petitionId: string): Promise<void> {
    const docRef = doc(db, "petition", petitionId);
    await updateDoc(docRef, {
      shares: increment(1),
    });
  }

  /**
   * Subscribe to real-time updates for a single petition document.
   * Returns an unsubscribe function.
   */
  onPetitionSnapshot(
    id: string,
    callback: (petition: Petition | null) => void
  ): () => void {
    const docRef = doc(db, "petition", id);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback(this.mapDocToPetition(docSnap.id, docSnap.data()));
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error("Petition snapshot error:", error);
        callback(null);
      }
    );

    return unsubscribe;
  }

  async addComment(
    petitionId: string,
    userId: string,
    userName: string,
    text: string
  ): Promise<Comment> {
    const commentData = {
      userId,
      userName,
      text,
      createdAt: Timestamp.now(),
    };
    const petitionDocRef = doc(db, "petition", petitionId);
    const commentColRef = collection(petitionDocRef, "comments");
    const docRef = await addDoc(commentColRef, commentData);
    return {
      id: docRef.id,
      userId,
      userName,
      text,
      createdAt: new Date(),
    };
  }

  onCommentsSnapshot(
    petitionId: string,
    callback: (comments: Comment[]) => void
  ): () => void {
    const petitionDocRef = doc(db, "petition", petitionId);
    const commentColRef = collection(petitionDocRef, "comments");
    const q = query(commentColRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const comments: Comment[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          let rawDate: Date;
          if (data.createdAt && typeof data.createdAt.toDate === "function") {
            rawDate = data.createdAt.toDate();
          } else if (data.createdAt) {
            rawDate = new Date(data.createdAt);
          } else {
            rawDate = new Date();
          }
          comments.push({
            id: doc.id,
            userId: data.userId || "",
            userName: data.userName || "",
            text: data.text || "",
            createdAt: rawDate,
          });
        });
        callback(comments);
      },
      (error) => {
        console.error("Comments snapshot error:", error);
        callback([]);
      }
    );

    return unsubscribe;
  }

  async addTimelineEvent(
    petitionId: string,
    event: Omit<TimelineEvent, "id" | "createdAt">
  ): Promise<TimelineEvent> {
    const eventData = {
      authorId: event.authorId,
      authorName: event.authorName,
      authorAvatarUrl: event.authorAvatarUrl || "",
      officialTitle: event.officialTitle || "",
      isOfficialResponse: event.isOfficialResponse,
      title: event.title,
      description: event.description,
      type: event.type,
      createdAt: Timestamp.now(),
    };
    const petitionDocRef = doc(db, "petition", petitionId);
    const timelineColRef = collection(petitionDocRef, "timeline");
    const docRef = await addDoc(timelineColRef, eventData);

    // Auto-dispatch notifications to all signers
    try {
      const petition = await this.getPetitionById(petitionId);
      if (petition) {
        const signers = petition.signatureUserIds || [];
        const title = `Mise à jour : ${petition.title}`;
        const message = `${event.authorName} a publié un nouveau jalon de négociation : "${event.title}".`;
        const notifyPromises = signers
          .filter((uid) => uid !== event.authorId)
          .map((uid) => this.createNotification(uid, title, message, "milestone", petitionId));
        await Promise.all(notifyPromises);
      }
    } catch (e) {
      console.warn("Failed to dispatch timeline notifications:", e);
    }

    return {
      id: docRef.id,
      ...event,
      createdAt: new Date(),
    };
  }

  onTimelineSnapshot(
    petitionId: string,
    callback: (events: TimelineEvent[]) => void
  ): () => void {
    const petitionDocRef = doc(db, "petition", petitionId);
    const timelineColRef = collection(petitionDocRef, "timeline");
    const q = query(timelineColRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const events: TimelineEvent[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          let rawDate: Date;
          if (data.createdAt && typeof data.createdAt.toDate === "function") {
            rawDate = data.createdAt.toDate();
          } else if (data.createdAt) {
            rawDate = new Date(data.createdAt);
          } else {
            rawDate = new Date();
          }
          events.push({
            id: doc.id,
            petitionId,
            authorId: data.authorId || "",
            authorName: data.authorName || "",
            authorAvatarUrl: data.authorAvatarUrl || "",
            officialTitle: data.officialTitle || "",
            isOfficialResponse: !!data.isOfficialResponse,
            title: data.title || "",
            description: data.description || "",
            createdAt: rawDate,
            type: data.type || "milestone",
          });
        });
        callback(events);
      },
      (error) => {
        console.error("Timeline snapshot error:", error);
        callback([]);
      }
    );

    return unsubscribe;
  }

  async declareVictory(petitionId: string): Promise<void> {
    const docRef = doc(db, "petition", petitionId);
    await updateDoc(docRef, {
      status: "victory",
    });

    // Auto-dispatch victory notifications to all signers
    try {
      const petition = await this.getPetitionById(petitionId);
      if (petition) {
        const signers = petition.signatureUserIds || [];
        const title = `Victoire ! 🎉 : ${petition.title}`;
        const message = `Félicitations ! La pétition "${petition.title}" a été déclarée victorieuse par son créateur.`;
        const notifyPromises = signers
          .filter((uid) => uid !== petition.createdBy)
          .map((uid) => this.createNotification(uid, title, message, "victory", petitionId));
        await Promise.all(notifyPromises);
      }
    } catch (e) {
      console.warn("Failed to dispatch victory notifications:", e);
    }
  }

  async getSignatures(petitionId: string): Promise<Signature[]> {
    const signatureCol = collection(db, "petition", petitionId, "signatures");
    const q = query(signatureCol, orderBy("signedAt", "desc"));
    const snapshot = await getDocs(q);
    const sigs: Signature[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      let rawDate = new Date();
      if (data.signedAt && typeof data.signedAt.toDate === "function") {
        rawDate = data.signedAt.toDate();
      } else if (data.signedAt) {
        rawDate = new Date(data.signedAt);
      }
      sigs.push({
        id: doc.id,
        userId: data.userId || "",
        userName: data.userName || "",
        signedAt: rawDate,
        reason: data.reason || "",
        city: data.city || "",
        country: data.country || "",
      });
    });
    return sigs;
  }

  async addDonation(
    petitionId: string,
    userId: string,
    userName: string,
    amount: number,
    currency?: string
  ): Promise<Donation> {
    const donationData = {
      petitionId,
      userId,
      userName,
      amount,
      currency: currency || "EUR",
      paymentStatus: "completed",
      createdAt: Timestamp.now(),
    };
    const donationsCol = collection(db, "donations");
    const docRef = await addDoc(donationsCol, donationData);
    return {
      id: docRef.id,
      petitionId,
      userId,
      userName,
      amount,
      currency: currency || "EUR",
      paymentStatus: "completed",
      createdAt: new Date(),
    };
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    const notificationsCol = collection(db, "notifications");
    const q = query(
      notificationsCol,
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    const notifs: Notification[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      let rawDate = new Date();
      if (data.createdAt && typeof data.createdAt.toDate === "function") {
        rawDate = data.createdAt.toDate();
      } else if (data.createdAt) {
        rawDate = new Date(data.createdAt);
      }
      notifs.push({
        id: doc.id,
        userId: data.userId || "",
        title: data.title || "",
        message: data.message || "",
        type: data.type || "milestone",
        petitionId: data.petitionId || "",
        read: !!data.read,
        createdAt: rawDate,
      });
    });
    // In-memory sort to avoid index requirement
    notifs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return notifs;
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    const notifDocRef = doc(db, "notifications", notificationId);
    await updateDoc(notifDocRef, {
      read: true,
    });
  }

  async deletePetition(petitionId: string): Promise<void> {
    const docRef = doc(db, "petition", petitionId);
    await deleteDoc(docRef);
  }

  async updatePetitionFeatured(petitionId: string, isFeatured: boolean): Promise<void> {
    const docRef = doc(db, "petition", petitionId);
    await updateDoc(docRef, { isFeatured });
  }

  onSignaturesSnapshot(
    petitionId: string,
    callback: (signatures: Signature[]) => void
  ): () => void {
    const signatureCol = collection(db, "petition", petitionId, "signatures");
    const q = query(signatureCol, orderBy("signedAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const sigs: Signature[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          let rawDate = new Date();
          if (data.signedAt && typeof data.signedAt.toDate === "function") {
            rawDate = data.signedAt.toDate();
          } else if (data.signedAt) {
            rawDate = new Date(data.signedAt);
          }
          sigs.push({
            id: doc.id,
            userId: data.userId || "",
            userName: data.userName || "",
            signedAt: rawDate,
            reason: data.reason || "",
            city: data.city || "",
            country: data.country || "",
          });
        });
        callback(sigs);
      },
      (error) => {
        console.error("Signatures snapshot error:", error);
        callback([]);
      }
    );

    return unsubscribe;
  }

  onNotificationsSnapshot(
    userId: string,
    callback: (notifications: Notification[]) => void
  ): () => void {
    const notificationsCol = collection(db, "notifications");
    const q = query(
      notificationsCol,
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notifs: Notification[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          let rawDate = new Date();
          if (data.createdAt && typeof data.createdAt.toDate === "function") {
            rawDate = data.createdAt.toDate();
          } else if (data.createdAt) {
            rawDate = new Date(data.createdAt);
          }
          notifs.push({
            id: doc.id,
            userId: data.userId || "",
            title: data.title || "",
            message: data.message || "",
            type: data.type || "milestone",
            petitionId: data.petitionId || "",
            read: !!data.read,
            createdAt: rawDate,
          });
        });
        // In-memory sort to avoid index requirement
        notifs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        callback(notifs);
      },
      (error) => {
        console.error("Notifications snapshot error:", error);
        callback([]);
      }
    );

    return unsubscribe;
  }

  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: string,
    petitionId: string
  ): Promise<void> {
    const notifData = {
      userId,
      title,
      message,
      type,
      petitionId,
      read: false,
      createdAt: Timestamp.now(),
    };
    await addDoc(collection(db, "notifications"), notifData);
  }
}

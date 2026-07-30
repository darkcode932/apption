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
  private cachedPetitions: Petition[] | null = null;
  private petitionByIdCache = new Map<string, { data: Petition; timestamp: number }>();
  private cacheTimestamp: number = 0;
  private CACHE_TTL_MS = 5000; // 5 seconds in-memory cache

  public invalidateCache(petitionId?: string) {
    this.cachedPetitions = null;
    this.cacheTimestamp = 0;
    if (petitionId) {
      this.petitionByIdCache.delete(petitionId);
    } else {
      this.petitionByIdCache.clear();
    }
  }

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
    this.invalidateCache();
    return this.mapDocToPetition(docRef.id, petitionData);
  }

  async getPetitionById(id: string): Promise<Petition | null> {
    const now = Date.now();
    const cached = this.petitionByIdCache.get(id);
    if (cached && now - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.data;
    }

    const docSnap = await getDoc(doc(db, "petition", id));
    if (!docSnap.exists()) return null;
    const pet = this.mapDocToPetition(docSnap.id, docSnap.data());
    this.petitionByIdCache.set(id, { data: pet, timestamp: now });
    return pet;
  }

  async getAllPetitions(category?: string, scale?: string): Promise<Petition[]> {
    const now = Date.now();
    let allPetitions: Petition[];

    if (this.cachedPetitions && now - this.cacheTimestamp < this.CACHE_TTL_MS) {
      allPetitions = this.cachedPetitions;
    } else {
      const petitionCol = collection(db, "petition");
      const q = query(petitionCol, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      allPetitions = [];
      snapshot.forEach((docSnap) => {
        const pet = this.mapDocToPetition(docSnap.id, docSnap.data());
        allPetitions.push(pet);
        this.petitionByIdCache.set(pet.id, { data: pet, timestamp: now });
      });
      this.cachedPetitions = allPetitions;
      this.cacheTimestamp = now;
    }

    return allPetitions.filter((p) => {
      if (category && p.category !== category) return false;
      if (scale && p.scale !== scale) return false;
      return true;
    });
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
    let modResult = { clean: true, reason: null as string | null, explanation: "No reason provided" };

    if (reason && reason.trim()) {
      modResult = await this.moderateText(reason, "signature_reason");
    }

    let signatureId = "";

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
      signatureId = signatureDocRef.id;
      
      transaction.set(signatureDocRef, {
        userId,
        userName,
        signedAt: Timestamp.now(),
        reason: reason || "",
        city: city || "",
        country: country || "",
        status: modResult.clean ? "approved" : "flagged",
        flagReason: modResult.reason,
        flagExplanation: modResult.explanation,
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

    if (!modResult.clean && signatureId) {
      await this.addGlobalFlaggedItem({
        type: "signature",
        petitionId,
        itemId: signatureId,
        authorName: userName,
        text: reason || "",
        flagReason: modResult.reason || "inappropriate",
        explanation: modResult.explanation,
      });
    }
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
    const modResult = await this.moderateText(text, "comment");

    const commentData = {
      userId,
      userName,
      text,
      createdAt: Timestamp.now(),
      status: modResult.clean ? "approved" : "flagged",
      flagReason: modResult.reason,
      flagExplanation: modResult.explanation,
    };
    const petitionDocRef = doc(db, "petition", petitionId);
    const commentColRef = collection(petitionDocRef, "comments");
    const docRef = await addDoc(commentColRef, commentData);

    if (!modResult.clean) {
      await this.addGlobalFlaggedItem({
        type: "comment",
        petitionId,
        itemId: docRef.id,
        authorName: userName,
        text,
        flagReason: modResult.reason || "inappropriate",
        explanation: modResult.explanation,
      });
    }

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
          if (data.status === "flagged") return;

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
    const combinedText = `${event.title}\n${event.description}`;
    const modResult = await this.moderateText(combinedText, "timeline");

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
      status: modResult.clean ? "approved" : "flagged",
      flagReason: modResult.reason,
      flagExplanation: modResult.explanation,
    };
    const petitionDocRef = doc(db, "petition", petitionId);
    const timelineColRef = collection(petitionDocRef, "timeline");
    const docRef = await addDoc(timelineColRef, eventData);

    if (!modResult.clean) {
      await this.addGlobalFlaggedItem({
        type: "timeline",
        petitionId,
        itemId: docRef.id,
        authorName: event.authorName,
        text: combinedText,
        flagReason: modResult.reason || "inappropriate",
        explanation: modResult.explanation,
      });
    }

    // Auto-dispatch notifications to all signers (only if clean/approved)
    if (modResult.clean) {
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
          if (data.status === "flagged") return;

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
          if (data.status === "flagged") return;

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

  // AI Semantic Moderation Methods implementation
  private async moderateText(
    text: string,
    type: "comment" | "timeline" | "signature_reason"
  ): Promise<{ clean: boolean; reason: string | null; explanation: string }> {
    try {
      const res = await fetch("/api/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type }),
      });
      if (!res.ok) throw new Error("API error");
      return await res.json();
    } catch (e) {
      console.warn("AI Moderation failed, using fallback:", e);
      return { clean: true, reason: null, explanation: "Approved by local fallback." };
    }
  }

  private async addGlobalFlaggedItem(data: {
    type: "comment" | "timeline" | "signature";
    petitionId: string;
    itemId: string;
    authorName: string;
    text: string;
    flagReason: string;
    explanation: string;
  }): Promise<void> {
    try {
      await addDoc(collection(db, "flagged_items"), {
        ...data,
        status: "flagged",
        createdAt: Timestamp.now(),
      });
    } catch (e) {
      console.error("Failed to add global flagged item:", e);
    }
  }

  async getFlaggedComments(): Promise<any[]> {
    const q = query(
      collection(db, "flagged_items"),
      where("type", "==", "comment"),
      where("status", "==", "flagged")
    );
    const snap = await getDocs(q);
    const items: any[] = [];
    snap.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() });
    });
    return items;
  }

  async getFlaggedTimelineEvents(): Promise<any[]> {
    const q = query(
      collection(db, "flagged_items"),
      where("type", "==", "timeline"),
      where("status", "==", "flagged")
    );
    const snap = await getDocs(q);
    const items: any[] = [];
    snap.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() });
    });
    return items;
  }

  async getFlaggedSignatures(): Promise<any[]> {
    const q = query(
      collection(db, "flagged_items"),
      where("type", "==", "signature"),
      where("status", "==", "flagged")
    );
    const snap = await getDocs(q);
    const items: any[] = [];
    snap.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() });
    });
    return items;
  }

  async approveComment(petitionId: string, commentId: string): Promise<void> {
    const commentRef = doc(db, "petition", petitionId, "comments", commentId);
    await updateDoc(commentRef, { status: "approved" });

    const q = query(
      collection(db, "flagged_items"),
      where("itemId", "==", commentId),
      where("petitionId", "==", petitionId)
    );
    const snap = await getDocs(q);
    const promises = snap.docs.map((docSnap) => deleteDoc(doc(db, "flagged_items", docSnap.id)));
    await Promise.all(promises);
  }

  async rejectComment(petitionId: string, commentId: string): Promise<void> {
    const commentRef = doc(db, "petition", petitionId, "comments", commentId);
    await deleteDoc(commentRef);

    const q = query(
      collection(db, "flagged_items"),
      where("itemId", "==", commentId),
      where("petitionId", "==", petitionId)
    );
    const snap = await getDocs(q);
    const promises = snap.docs.map((docSnap) => deleteDoc(doc(db, "flagged_items", docSnap.id)));
    await Promise.all(promises);
  }

  async approveTimelineEvent(petitionId: string, eventId: string): Promise<void> {
    const eventRef = doc(db, "petition", petitionId, "timeline", eventId);
    await updateDoc(eventRef, { status: "approved" });

    const q = query(
      collection(db, "flagged_items"),
      where("itemId", "==", eventId),
      where("petitionId", "==", petitionId)
    );
    const snap = await getDocs(q);
    const promises = snap.docs.map((docSnap) => deleteDoc(doc(db, "flagged_items", docSnap.id)));
    await Promise.all(promises);
  }

  async rejectTimelineEvent(petitionId: string, eventId: string): Promise<void> {
    const eventRef = doc(db, "petition", petitionId, "timeline", eventId);
    await deleteDoc(eventRef);

    const q = query(
      collection(db, "flagged_items"),
      where("itemId", "==", eventId),
      where("petitionId", "==", petitionId)
    );
    const snap = await getDocs(q);
    const promises = snap.docs.map((docSnap) => deleteDoc(doc(db, "flagged_items", docSnap.id)));
    await Promise.all(promises);
  }

  async approveSignature(petitionId: string, signatureId: string): Promise<void> {
    const sigRef = doc(db, "petition", petitionId, "signatures", signatureId);
    await updateDoc(sigRef, { status: "approved" });

    const q = query(
      collection(db, "flagged_items"),
      where("itemId", "==", signatureId),
      where("petitionId", "==", petitionId)
    );
    const snap = await getDocs(q);
    const promises = snap.docs.map((docSnap) => deleteDoc(doc(db, "flagged_items", docSnap.id)));
    await Promise.all(promises);
  }

  async rejectSignature(petitionId: string, signatureId: string): Promise<void> {
    const sigRef = doc(db, "petition", petitionId, "signatures", signatureId);
    const sigSnap = await getDoc(sigRef);
    if (sigSnap.exists()) {
      const sigData = sigSnap.data();
      const userId = sigData.userId;
      const userName = sigData.userName;
      
      const petitionRef = doc(db, "petition", petitionId);
      const petitionSnap = await getDoc(petitionRef);
      if (petitionSnap.exists()) {
        const petitionData = petitionSnap.data();
        const userIds = (petitionData.signatureUserIds || []).filter((id: string) => id !== userId);
        const names = (petitionData.signatureNames || []).filter((n: string) => n !== userName);
        await updateDoc(petitionRef, {
          signatureUserIds: userIds,
          signatureNames: names,
          signaturesCount: increment(-1)
        });
      }
    }
    await deleteDoc(sigRef);

    const q = query(
      collection(db, "flagged_items"),
      where("itemId", "==", signatureId),
      where("petitionId", "==", petitionId)
    );
    const snap = await getDocs(q);
    const promises = snap.docs.map((docSnap) => deleteDoc(doc(db, "flagged_items", docSnap.id)));
    await Promise.all(promises);
  }
}

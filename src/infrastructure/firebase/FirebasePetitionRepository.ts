import { PetitionRepository } from "../../domain/repositories/PetitionRepository";
import { Petition } from "../../domain/entities/Petition";
import { Comment } from "../../domain/entities/Comment";
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
    };
  }

  async createPetition(
    title: string,
    description: string,
    scale: string,
    category: string,
    creatorId: string,
    creatorName: string,
    imageFile?: File | null
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
   * Throws an error if the user has already signed.
   */
  async signPetition(petitionId: string, userId: string, userName: string): Promise<void> {
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

      transaction.update(docRef, {
        signatureUserIds: arrayUnion(userId),
        signatureNames: arrayUnion(userName),
        signaturesCount: increment(1),
      });
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
}

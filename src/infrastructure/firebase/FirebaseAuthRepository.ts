import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { User } from "../../domain/entities/User";
import { auth, db, storage } from "./firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  AuthProvider,
  UserCredential,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export class FirebaseAuthRepository implements AuthRepository {
  private async fetchUserData(uid: string, email: string): Promise<User> {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: uid,
        email: email,
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        username: data.username || "",
        bio: data.bio || "",
        location: data.location || "",
        avatarUrl: data.avatarUrl || "",
      };
    }
    return {
      id: uid,
      email: email,
      firstname: "",
      lastname: "",
      username: email.split("@")[0],
      bio: "",
      location: "",
      avatarUrl: "",
    };
  }

  /**
   * Shared handler for social sign-in (Google, Facebook).
   * Creates a Firestore user document if one doesn't exist yet.
   */
  private async handleSocialSignIn(provider: AuthProvider): Promise<User> {
    const userCredential: UserCredential = await signInWithPopup(auth, provider);
    const firebaseUser = userCredential.user;
    if (!firebaseUser) throw new Error("Erreur de connexion sociale");

    const uid = firebaseUser.uid;
    const email = firebaseUser.email || "";

    // Check if user document already exists
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      // First-time social login — create user profile from provider data
      const displayName = firebaseUser.displayName || "";
      const nameParts = displayName.split(" ");
      const firstname = nameParts[0] || "";
      const lastname = nameParts.slice(1).join(" ") || "";
      const username = email.split("@")[0] || displayName.replace(/\s+/g, "").toLowerCase();
      const avatarUrl = firebaseUser.photoURL || "";

      await setDoc(userDocRef, {
        email,
        firstname,
        lastname,
        username,
        avatarUrl,
        bio: "",
        location: "",
        createdAt: new Date(),
        provider: (provider as any).providerId || "social",
      });

      return { id: uid, email, firstname, lastname, username, bio: "", location: "", avatarUrl };
    }

    return this.fetchUserData(uid, email);
  }

  async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    if (!firebaseUser) throw new Error("Erreur de connexion");
    return this.fetchUserData(firebaseUser.uid, firebaseUser.email || email);
  }

  async signUp(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    username: string
  ): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    if (!firebaseUser) throw new Error("Erreur de création du compte");

    await updateProfile(firebaseUser, { displayName: username });

    const userDocRef = doc(db, "users", firebaseUser.uid);
    await setDoc(userDocRef, {
      email,
      firstname,
      lastname,
      username,
      bio: "",
      location: "",
      avatarUrl: "",
      createdAt: new Date(),
    });

    return {
      id: firebaseUser.uid,
      email,
      firstname,
      lastname,
      username,
      bio: "",
      location: "",
      avatarUrl: "",
    };
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;
    return this.fetchUserData(firebaseUser.uid, firebaseUser.email || "");
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const user = await this.fetchUserData(firebaseUser.uid, firebaseUser.email || "");
          callback(user);
        } catch (error) {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    return this.handleSocialSignIn(provider);
  }

  async signInWithFacebook(): Promise<User> {
    const provider = new FacebookAuthProvider();
    provider.addScope("email");
    provider.addScope("public_profile");
    return this.handleSocialSignIn(provider);
  }

  async updateUserProfile(
    userId: string,
    data: {
      firstname?: string;
      lastname?: string;
      username?: string;
      bio?: string;
      location?: string;
      avatarUrl?: string;
      latitude?: number;
      longitude?: number;
      country?: string;
      city?: string;
    }
  ): Promise<void> {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, data);
  }

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  async uploadAvatar(userId: string, imageFile: File): Promise<string> {
    const storageRef = ref(storage, `avatars/${userId}_${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    return getDownloadURL(snapshot.ref);
  }
}

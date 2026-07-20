import { User } from "../entities/User";

export interface AuthRepository {
  signIn(email: string, password: string): Promise<User>;
  signUp(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    username: string
  ): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;

  /** Sign in (or sign up) using Google OAuth popup. */
  signInWithGoogle(): Promise<User>;

  /** Sign in (or sign up) using Facebook OAuth popup. */
  signInWithFacebook(): Promise<User>;

  /** Update profile data for the authenticated user in Firestore. */
  updateUserProfile(
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
      role?: "user" | "admin" | "super_admin";
    }
  ): Promise<void>;

  /** Send a password reset email via Firebase. */
  sendPasswordReset(email: string): Promise<void>;

  /** Upload an avatar picture to Firebase Storage and return the URL. */
  uploadAvatar(userId: string, imageFile: File): Promise<string>;

  /** Retrieve all users in the system (Admin only). */
  getAllUsers(): Promise<User[]>;

  /** Change a user's role (Super Admin only). */
  updateUserRole(
    targetUserId: string,
    newRole: "user" | "admin" | "super_admin"
  ): Promise<void>;

  /** Mark a user as verified with an optional official title (Admin / Super Admin only). */
  setUserVerification(
    targetUserId: string,
    isVerified: boolean,
    officialTitle?: string
  ): Promise<void>;
}

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
      firstname: string;
      lastname: string;
      username: string;
      bio?: string;
      location?: string;
      avatarUrl?: string;
    }
  ): Promise<void>;

  /** Send a password reset email via Firebase. */
  sendPasswordReset(email: string): Promise<void>;
}

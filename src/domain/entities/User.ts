export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  officialTitle?: string;
}

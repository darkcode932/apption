export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "milestone" | "victory" | "signature" | "comment";
  petitionId: string;
  read: boolean;
  createdAt: Date;
}

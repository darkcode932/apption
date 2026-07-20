export interface Donation {
  id: string;
  petitionId: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  paymentStatus: "completed" | "pending";
  createdAt: Date;
}

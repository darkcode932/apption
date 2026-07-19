export interface TimelineEvent {
  id: string;
  petitionId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  officialTitle?: string;
  isOfficialResponse: boolean;
  title: string;
  description: string;
  createdAt: Date;
  type: "milestone" | "official_response" | "victory";
}

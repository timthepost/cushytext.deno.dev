export interface PostFeedback {
  timestamp: Date;
  basename: string;
  vote: number;
  comment: string | null;
}

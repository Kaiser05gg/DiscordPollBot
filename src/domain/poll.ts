export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}
// 親ドキュメント（poll_results）
export interface PollDocument {
  id: string;
  uuid: string;
  question: string;

  createdAt?: Date;
  updatedAt?: Date;
  votedAt?: Date;
}
export interface CronResult {
  timestamp: Date;
  topOption: string;
  results: Record<string, number>;
}
export interface PollResultDetail {
  timestamp: Date;
  topOption: string;
  results: Record<string, number>;
}
export interface PollDetailResponse {
  id: string;
  uuid: string;
  question: string;

  createdAt?: Date;
  updatedAt?: Date;
  votedAt?: Date;

  cron: CronResult | null;
  poll: PollResultDetail | null;
}

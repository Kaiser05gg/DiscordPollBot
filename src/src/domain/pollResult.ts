export interface PollResult {
  message_id: string;
  question: string; // 質問文
  results: Record<string, number>; // 各選択肢の得票数
  top_option: string | null; // 最多票の選択肢
  voted_at: Date; // 投票日
}

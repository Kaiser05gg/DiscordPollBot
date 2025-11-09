export interface Poll {
  messageId: string;
  guildId: string | null; //DMではnull
  channelId: string;
  question: string;
  createdAt?: Date;
  closedAt?: Date | null;
}

// 投票の選択肢
export interface PollOption {
  optionId: number;
  label: string;
}

// 投票結果（投票者の選択）
export interface PollVote {
  messageId: string;
  userId: string;
  optionId: number;
  votedAt?: Date;
}

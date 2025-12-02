export interface DiscordPoll {
  messageId: string;
  guildId: string | null;
  channelId: string;
  question: string;
  createdAt?: Date;
  closedAt?: Date | null;
}

export interface DiscordPollOption {
  optionId: number;
  label: string;
}

export interface DiscordPollVote {
  messageId: string;
  userId: string;
  optionId: number;
  votedAt?: Date;
}

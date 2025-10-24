export interface Poll {
  messageId: string;
  guildId: string | null;
  channelId: string;
  question: string;
}

export interface PollOption {
  id: number;
  text: string;
}

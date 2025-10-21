import "discord.js";

declare module "discord.js" {
  interface MessagePollVoteAdd {
    message: Message;
    user: User;
    option: PollAnswer;
  }

  interface MessagePollVoteRemove {
    message: Message;
    user: User;
    option: PollAnswer;
  }
}

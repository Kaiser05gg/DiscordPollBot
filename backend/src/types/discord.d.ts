declare module "discord.js" {
  export interface MessageCreateOptions {
    poll?: {
      question: {
        text: string;
      };
      answers: {
        text: string;
      }[];
      allowMultiselect?: boolean;
      duration?: number;
      layoutType?: number;
    };
  }

  export interface MessagePollVoteAdd {
    message: import("discord.js").Message;
    user: import("discord.js").User;
    pollAnswer: {
      id: number;
      text: string;
    };
  }

  export interface MessagePollVoteRemove {
    message: import("discord.js").Message;
    user: import("discord.js").User;
    pollAnswer: {
      id: number;
      text: string;
    };
  }
}

export {};

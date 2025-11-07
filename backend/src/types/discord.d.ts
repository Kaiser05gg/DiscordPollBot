/// <reference types="discord.js" />
import "discord.js";

declare module "discord.js" {
  // Poll付きメッセージ送信時の型拡張
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

  // Poll 投票追加イベント
  export interface MessagePollVoteAdd {
    message: import("discord.js").Message;
    user: import("discord.js").User;
    pollAnswer: {
      id: number;
      text: string;
    };
  }

  // Poll 投票削除イベント
  export interface MessagePollVoteRemove {
    message: import("discord.js").Message;
    user: import("discord.js").User;
    pollAnswer: {
      id: number;
      text: string;
    };
  }

  // カスタムPollVoteイベント型（MessagePollVoteAdd/Remove両対応）
  export interface PollVoteEvent {
    message: Message;
    option: {
      text: string;
    };
  }
}

export {};

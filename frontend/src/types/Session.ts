interface ChatMessage {
    sender: string;
    message: string;
    timestamp: Date;
  }

export interface ISession {
    _id: string;
    sessionTitle: string;
    problemId: string;
    createdBy: string;
    participants: string[];
    duration: number;
    code: string;
    language: string;
    chatHistory: ChatMessage[];
    notes: string;
    isFreestyle: boolean;
    isFavorite: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

export type SessionState = {
    all: ISession[];
    favorites: ISession[];
  };
  
export type Session = {
    id: string;
    appId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
};

export type Message = {
    id: string;
    sessionId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
};

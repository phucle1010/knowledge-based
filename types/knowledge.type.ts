export type Knowledge = {
    id: string;
    question: string;
    answer: string;
    isVerified: boolean;
    category: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
};

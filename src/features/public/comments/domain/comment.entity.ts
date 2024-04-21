import { REACTIONS_ENUM } from '../api/models/output/comments.output.models';

export type CommentsDBType = {
    postId: string;
    content: string;
    userId: string;
    createdAt: Date;
};

export type StatusType = {
    userId: string;
    createdAt: Date;
    status: REACTIONS_ENUM;
};

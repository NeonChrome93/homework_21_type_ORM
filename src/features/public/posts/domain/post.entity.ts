import { REACTIONS_ENUM } from '../../comments/api/models/output/comments.output.models';

export type postDbType = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
    reactions: StatusType[];
};

export class Post {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
    reactions: StatusType[];
}

export class StatusType {
    userId: string;
    login: string;
    createdAt: Date;
    status: REACTIONS_ENUM;
}

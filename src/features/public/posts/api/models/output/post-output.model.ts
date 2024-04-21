import { REACTIONS_ENUM } from '../../../../comments/api/models/output/comments.output.models';

export type PostsQueryType = {
    pageNumber: string;
    pageSize: string;
    sortBy: string;
    sortDirection: string;
    searchNameTerm: string | null;
};

export type likeTypePost = {
    userId: string;
    createdAt: string;
    status: REACTIONS_ENUM;
    postId: string;
};

export class PostViewType {
    constructor(
        public id: string,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: Date,
        public extendedLikesInfo: { likesCount: number; newestLikes: any[]; dislikesCount: number; myStatus: string },
    ) {}
}

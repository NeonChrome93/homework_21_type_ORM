import { Injectable } from '@nestjs/common';
import { QueryPaginationType } from '../../../../utils/pagination';
import { DataSource, Repository } from 'typeorm';
import { CommentsViewType } from '../api/models/output/comments.output.models';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from '../domain/comment.entity';
import { Comments_likes } from '../domain/comments.likes.entity';

@Injectable()
export class CommentsQueryRepository {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(Comments) public commentRepository: Repository<Comments>,
        @InjectRepository(Comments_likes) public commentLikeRepository: Repository<Comments_likes>,
    ) {}

    async readCommentByPostId(postId: string, pagination: QueryPaginationType, userId?: string | null) {
        // const filter: FilterQuery<CommentsDBType> = { postId };
        // const comments: CommentsDBType[] = await this.CommentModel.find(filter)
        //     .sort({ [pagination.sortBy]: pagination.sortDirection })
        //     .skip(pagination.skip)
        //     .limit(pagination.pageSize)
        //     .lean();
        //
        // const totalCount = await this.CommentModel.countDocuments(filter).exec();
        // const items: CommentsViewType[] = comments.map((c: CommentsDBType) => ({
        //     id: c._id.toString(),
        //     content: c.content,
        //     commentatorInfo: c.commentatorInfo,
        //     createdAt: c.createdAt.toISOString(),
        //     likesInfo: {
        //         likesCount: c.reactions.filter(r => r.status === REACTIONS_ENUM.Like).length,
        //         dislikesCount: c.reactions.filter(r => r.status === REACTIONS_ENUM.Dislike).length,
        //         myStatus: userId
        //             ? c.reactions.filter(r => r.userId === userId).length
        //                 ? c.reactions.filter(r => r.userId === userId)[0].status
        //                 : REACTIONS_ENUM.None
        //             : REACTIONS_ENUM.None,
        //     },
        // }));
        // const pagesCount = Math.ceil(totalCount / pagination.pageSize);
        // return {
        //     pagesCount: pagesCount === 0 ? 1 : pagesCount,
        //     page: pagination.pageNumber,
        //     pageSize: pagination.pageSize,
        //     totalCount,
        //     items,
        // }
        const query = `WITH comment_info AS (
    SELECT 
        c.id AS comment_id,
        c.content AS content,
        c."userId" AS commentator_id,
        u."login" AS user_login,
        c."createdAt" AS created_at
    FROM comments c    
    LEFT JOIN "user" u 
    ON c."userId" = u."id"
    WHERE "postId" =$1
    ),
    likes_info AS (
    SELECT 
        c.id AS comment_id,
        COUNT(CASE WHEN l.status = 'Like' THEN 1 END) AS likes_count,
        COUNT(CASE WHEN l.status = 'Dislike' THEN 1 END) AS dislikes_count,
     COALESCE((SELECT l2.status FROM comments_likes l2 WHERE l2."commentId" = c.id AND l2."userId" = $2 LIMIT 1), 'None') AS myStatus
    FROM comments c
    LEFT JOIN comments_likes l ON c.id = l."commentId"
    GROUP BY c.id
    )
    SELECT 
        c.comment_id AS id,
        c.content AS content,
        json_build_object('userId', c.commentator_id, 'userLogin', c.user_login) AS "commentatorInfo",
        c.created_at AS "createdAt",
        json_build_object('likesCount', COALESCE(l.likes_count, 0), 'dislikesCount', COALESCE(l.dislikes_count, 0), 'myStatus', COALESCE(l.myStatus, 'None')) AS "likesInfo"
        FROM comment_info c
        LEFT JOIN likes_info l ON c.comment_id = l.comment_id
        ORDER BY "${pagination.sortBy}" ${pagination.sortDirection}
        LIMIT ${pagination.pageSize} offset ${(pagination.pageNumber - 1) * pagination.pageSize}
       ;`;

        const queryCount = `SELECT COUNT(id) FROM public.comments
                            WHERE "postId" =$1`;

        const totalPostCount = await this.dataSource.query(queryCount, [postId]);
        const totalCount = parseInt(totalPostCount[0].count);
        const view = await this.dataSource.query(query, [postId, userId]);

        const pagesCount = Math.ceil(totalCount / pagination.pageSize);
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items: view,
        };
    }
    //
    // async readCommentId(id: string, userId?: string | null): Promise<CommentsViewType | null> {
    //     console.log('UserId', userId);
    //     const query = `WITH comment_info AS (
    // SELECT
    //     c.id AS comment_id,
    //     c.content AS content,
    //     c."userId" AS commentator_id,
    //     u."login" AS user_login,
    //     c."createdAt" AS created_at
    // FROM comments c
    // LEFT JOIN "user" AS u
    // ON c."userId" = u."id"
    // WHERE c.id = $1
    // ),
    // likes_info AS (
    // SELECT
    //     c.id AS comment_id,
    //     COUNT(CASE WHEN l.status = 'Like' THEN 1 END) AS likes_count,
    //     COUNT(CASE WHEN l.status = 'Dislike' THEN 1 END) AS dislikes_count,
    //  COALESCE((SELECT l2.status FROM comments_likes l2 WHERE l2."commentId" = c.id AND l2."userId" = $2 LIMIT 1), 'None') AS myStatus
    // FROM comments c
    // LEFT JOIN comments_likes l ON c.id = l."commentId"
    // GROUP BY c.id
    // )
    // SELECT
    //     c.comment_id AS id,
    //     c.content AS content,
    //     json_build_object('userId', c.commentator_id, 'userLogin', c.user_login) AS "commentatorInfo",
    //     c.created_at AS "createdAt",
    //     json_build_object('likesCount', COALESCE(l.likes_count, 0), 'dislikesCount', COALESCE(l.dislikes_count, 0), 'myStatus', COALESCE(l.myStatus, 'None')) AS "likesInfo"
    //     FROM comment_info c
    //     LEFT JOIN likes_info l ON c.comment_id = l.comment_id;`;
    //
    //     const view = await this.dataSource.query(query, [id, userId]);
    //     return view[0];
    // }

    async readCommentId(id: string, userId?: string | null): Promise<CommentsViewType | null> {
        console.log('UserId', userId);

        const comment = await this.commentRepository
            .createQueryBuilder('c')
            .select(['c.id', 'c.content', 'c.userId', 'u.login', 'c.createdAt'])
            .leftJoin('c.user', 'u')
            .where('c.id = :id', { id })
            .getOne();

        if (!comment) {
            return null;
        }

        const { likesCount, dislikesCount, myStatus } = await this.commentRepository
            .createQueryBuilder('c')
            .select([
                ' c.id AS comment_id',
                // prettier-ignore
                "CAST(COALESCE(COUNT(CASE WHEN l.status = 'Like' THEN 1 END), 0) AS int) AS \"likesCount\"",
                // prettier-ignore
                "CAST(COALESCE(COUNT(CASE WHEN l.status = 'Dislike' THEN 1 END), 0) AS int) AS \"dislikesCount\"",
                // prettier-ignore
                'COALESCE((SELECT l2.status FROM comments_likes l2 WHERE l2."commentId" = c.id AND l2."userId" = :userId LIMIT 1), \'None\') AS \"myStatus\"',
            ])
            .leftJoin('c.likes', 'l')
            .where('c.id = :id', { id })
            .groupBy('c.id')
            .setParameter('userId', userId)
            .getRawOne();
        //console.error(result, ' res');
        console.error(comment, ' comment');
        //const { likesCount, dislikesCount, myStatus } = result;

        const view: CommentsViewType = {
            id: comment.id,
            content: comment.content,
            commentatorInfo: { userId: comment.userId, userLogin: comment.user.login },
            createdAt: comment.createdAt.toISOString(),
            likesInfo: { likesCount, dislikesCount, myStatus: myStatus },
        };

        return view;
        //return null;
    }
}

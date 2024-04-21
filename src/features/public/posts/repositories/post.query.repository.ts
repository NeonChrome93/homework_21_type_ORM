import { Injectable } from '@nestjs/common';
import { PostViewType } from '../api/models/output/post-output.model';
import { PaginationModels, QueryPaginationType } from '../../../../utils/pagination';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsQueryRepository {
    constructor(private readonly dataSource: DataSource) {}

    async readPosts(
        pagination: QueryPaginationType,
        userId?: string | null,
    ): Promise<PaginationModels<PostViewType[]>> {
        //       const queryFilter = `
        // 			select *
        // 				from public.posts
        // 					order by "${pagination.sortBy}" ${pagination.sortDirection}
        // 				 limit ${pagination.pageSize} offset ${(pagination.pageNumber - 1) * pagination.pageSize}
        //
        // `;
        //       const posts = await this.dataSource.query(queryFilter);
        //       console.log(posts[0]);
        //       const queryCount = `SELECT count(id)
        //                           FROM public.posts`;
        //
        //       const totalPostCount = await this.dataSource.query(queryCount, []);
        //       const totalCount = parseInt(totalPostCount[0].count);
        //
        //       const mapper = new PostMapperImp();
        //       const items: PostViewType[] = posts.map((post: postDbType) => mapper.mapPostDbToPostView(post));
        //       const pagesCount = Math.ceil(totalCount / pagination.pageSize);
        //       return {
        //           pagesCount: pagesCount === 0 ? 1 : pagesCount,
        //           page: pagination.pageNumber,
        //           pageSize: pagination.pageSize,
        //           totalCount,
        //           items,
        //       };
        const query = `WITH post_likes_view AS (
    SELECT
        "postId",
        "userId",
        "createdAt",
        status,
        ROW_NUMBER() OVER (PARTITION BY "postId" ORDER BY "createdAt" DESC) AS rn
    FROM post_likes
)
SELECT
    p.id,
    p.title,
    p."shortDescription",
    p.content,
    p."blogId",
    p."blogName",
    p."createdAt",
     JSON_BUILD_OBJECT
    ('likesCount',  (SELECT COUNT(*) FROM post_likes
                    WHERE "status" = 'Like' AND "postId" = p.id),
     'dislikesCount',(SELECT COUNT(*) FROM post_likes
                    WHERE "status" = 'Dislike' AND "postId" =p.id),
    'myStatus', COALESCE((SELECT l2.status FROM post_likes l2 WHERE l2."postId" = p.id AND l2."userId" = $1 LIMIT 1), 'None'),
    'newestLikes', COALESCE(JSON_AGG(
        json_build_object(
            'addedAt', pl."createdAt",
            'userId', pl."userId",
            'login', u.login
        ) ORDER BY pl."createdAt" DESC
    ) FILTER (WHERE pl.rn IS NOT NULL  AND pl.status = 'Like'), '[]'::json)) AS "extendedLikesInfo" 
FROM posts p
LEFT JOIN post_likes_view pl ON p.id = pl."postId" AND pl.rn <= 3
LEFT JOIN users u ON pl."userId" = u.id
LEFT JOIN (
    SELECT "postId", status 
    FROM post_likes 
    WHERE "userId" = $1
) myLikes ON p.id = myLikes."postId"
GROUP BY p.id
ORDER BY "${pagination.sortBy}" ${pagination.sortDirection}
LIMIT ${pagination.pageSize} offset ${(pagination.pageNumber - 1) * pagination.pageSize}`;

        const queryCount = `SELECT count(id) FROM public.posts`;

        const totalPostCount = await this.dataSource.query(queryCount, []);
        const totalCount = parseInt(totalPostCount[0].count);

        const pagesCount = Math.ceil(totalCount / pagination.pageSize);
        const view = await this.dataSource.query(query, [userId]);

        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items: view,
        };
    }

    async readPostId(postId: string, userId?: string | null): Promise<PostViewType | null> {
        const query = `WITH post_likes_view AS (
    SELECT
        "postId",
        "userId",
        "createdAt",
         status,
        ROW_NUMBER() OVER (PARTITION BY "postId" ORDER BY "createdAt" DESC) AS rn
    FROM post_likes   
)
SELECT
    p.id,
    p.title,
    p."shortDescription",
    p.content,
    p."blogId",
    p."blogName",
    p."createdAt",
     JSON_BUILD_OBJECT
    ('likesCount',  (SELECT COUNT(*) FROM post_likes
                    WHERE "status" = 'Like' AND "postId" = $2),
     'dislikesCount',(SELECT COUNT(*) FROM post_likes
                    WHERE "status" = 'Dislike' AND "postId" = $2),
     'myStatus', COALESCE((SELECT l2.status FROM post_likes l2 WHERE l2."postId" = p.id AND l2."userId" = $1 LIMIT 1), 'None'),
      'newestLikes', COALESCE(JSON_AGG(
        json_build_object(
            'addedAt', pl."createdAt",
            'userId', pl."userId",
            'login', u.login
        ) ORDER BY pl."createdAt" DESC
    ) FILTER (WHERE pl.rn IS NOT NULL AND pl.status = 'Like'), '[]'::json)) AS "extendedLikesInfo" 
FROM posts p
LEFT JOIN post_likes_view pl ON p.id = pl."postId" AND pl.rn <= 3 
LEFT JOIN users u ON pl."userId" = u.id
LEFT JOIN (
    SELECT "postId", status 
    FROM post_likes 
    WHERE "userId" = $1
) myLikes ON p.id = myLikes."postId"
WHERE p.id = $2
GROUP BY p.id;`;

        const view = await this.dataSource.query(query, [userId, postId]);
        console.log(view);
        return view[0];
    }
}

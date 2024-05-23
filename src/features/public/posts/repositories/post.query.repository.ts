import { Injectable } from '@nestjs/common';
import { PostViewType } from '../api/models/output/post-output.model';
import { PaginationModels, QueryPaginationType } from '../../../../utils/pagination';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post, postDbType } from '../domain/post.entity';
import { Post_likes } from '../domain/post.lilkes.entity';

@Injectable()
export class PostsQueryRepository {
    constructor(
        @InjectRepository(Post) public postRepository: Repository<Post>,
        @InjectRepository(Post_likes) public postLikesRepository: Repository<Post_likes>,
        private readonly dataSource: DataSource,
    ) {}

    async readPosts(
        pagination: QueryPaginationType,
        userId?: string | null,
    ): Promise<PaginationModels<PostViewType[]>> {
        // const queryFilter = `
        // 			select *
        // 				from public.posts
        // 					order by "${pagination.sortBy}" ${pagination.sortDirection}
        // 				 limit ${pagination.pageSize} offset ${(pagination.pageNumber - 1) * pagination.pageSize}`;
        //
        // const posts = await this.postRepository.find({
        //     order: {
        //         [pagination.sortBy]: pagination.sortDirection,
        //     },
        //     take: pagination.pageSize,
        //     skip: (pagination.pageNumber - 1) * pagination.pageSize,
        // } as FindManyOptions<Post>);
        //
        // const totalPostCount = await this.postRepository.count();
        //
        // const totalCount = totalPostCount;
        //
        // const mapper = new PostMapperImp();
        // const items: PostViewType[] = posts.map((post: postDbType) => mapper.mapPostDbToPostView(post));
        // const pagesCount = Math.ceil(totalCount / pagination.pageSize);
        // return {
        //     pagesCount: pagesCount === 0 ? 1 : pagesCount,
        //     page: pagination.pageNumber,
        //     pageSize: pagination.pageSize,
        //     totalCount,
        //     items,
        // };
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
        FROM post p
        LEFT JOIN post_likes_view pl ON p.id = pl."postId" AND pl.rn <= 3
        LEFT JOIN "user" u ON pl."userId" = u."id"
        LEFT JOIN (
            SELECT "postId", status
            FROM post_likes
            WHERE "userId" = $1
        ) myLikes ON p.id = myLikes."postId"
        GROUP BY p.id
        ORDER BY "${pagination.sortBy}" ${pagination.sortDirection}
        LIMIT ${pagination.pageSize} offset ${(pagination.pageNumber - 1) * pagination.pageSize}`;

        const queryCount = `SELECT count(id) FROM public.post`;

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
        console.log('UserPost', userId);
        // Отделенное получение счетчиков лайков и дизлайков
        const likesCountQuery = this.postLikesRepository
            .createQueryBuilder('likes')
            .where('likes.postId = :postId AND likes.status = :status', { postId, status: 'Like' })
            .getCount();

        const dislikesCountQuery = this.postLikesRepository
            .createQueryBuilder('likes')
            .where('likes.postId = :postId AND likes.status = :status', { postId, status: 'Dislike' })
            .getCount();

        // Получение статуса реакции пользователя
        const myStatusQuery = this.postLikesRepository
            .createQueryBuilder('likes')
            .where('likes.postId = :postId AND likes.userId = :userId', { postId, userId })
            .select(['likes.status'])
            .getOne();
        // console.log('myStatus', myStatus);
        // Получение последних лайков
        const newestLikesQuery = this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.likes', 'likes')
            .leftJoinAndSelect('likes.user', 'user')
            .where('post.id = :postId AND likes.status = :status', { postId, status: 'Like' })
            .orderBy('likes.createdAt', 'DESC')
            .limit(3)
            .select(['likes.createdAt AS "addedAt"', 'likes.userId', 'user.login'])
            .getRawMany();

        // Основной запрос на получение поста
        const postQuery = this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.blog', 'blog')
            .where('post.id = :id', { id: postId })
            .select([
                'post.id',
                'post.title',
                'post.shortDescription',
                'post.content',
                'post.blogId',
                'post.blogName',
                'post.createdAt',
            ])
            .getOne();

        try {
            // Выполняем все запросы параллельно
            const [likesCount, dislikesCount, myStatus, newestLikes, post] = await Promise.all([
                likesCountQuery,
                dislikesCountQuery,
                myStatusQuery,
                newestLikesQuery,
                postQuery,
            ]);

            if (post) {
                const extendedLikesInfo = {
                    likesCount: likesCount,
                    dislikesCount: dislikesCount,
                    myStatus: myStatus ? (myStatus as Post_likes).status : 'None',
                    newestLikes: (newestLikes as any[]).map(el => ({
                        addedAt: el.addedAt,
                        userId: el.likes_userId,
                        login: el.user_login,
                    })),
                };

                const postView = {
                    ...post,
                    extendedLikesInfo,
                };

                return postView as PostViewType;
            }

            return null;
        } catch (error) {
            console.error('Error reading ', error);
            return null;
        }
    }
}

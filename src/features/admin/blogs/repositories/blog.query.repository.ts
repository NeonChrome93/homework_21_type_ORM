import { Injectable } from '@nestjs/common';
import { PaginationModels, QueryPaginationType } from '../../../../utils/pagination';
import { BlogsViewType } from '../api/models/output/blog.output.model';
import { DataSource, FindManyOptions, ILike } from 'typeorm';
import { Blog, BlogDbType } from '../domain/blog.entity';
import { PostViewType } from '../../../public/posts/api/models/output/post-output.model';
import { Post, postDbType } from '../../../public/posts/domain/post.entity';

@Injectable()
export class BlogQueryRepository {
    constructor(private dataSource: DataSource) {}

    async readBlogs(pagination: QueryPaginationType): Promise<PaginationModels<BlogsViewType[]>> {
        //       const queryFilter = `
        // 			select *
        // 				from public."blogs"
        // 				WHERE "name" ILIKE '%${pagination.searchNameTerm}%'
        // 					order by "${pagination.sortBy}" ${pagination.sortDirection}
        // 				  limit ${pagination.pageSize} offset ${(pagination.pageNumber - 1) * pagination.pageSize}
        // `;

        const findAllBlogs = await this.dataSource.getRepository(Blog).find({
            where: {
                name: ILike(`%${pagination.searchNameTerm}%`),
            },
            order: { [pagination.sortBy]: pagination.sortDirection },
            take: pagination.pageSize,
            skip: (pagination.pageNumber - 1) * pagination.pageSize,
        } as FindManyOptions<Blog>);

        // console.log(findAllUsers);
        // const countTotalCount = `
        // SELECT count(id)
        // from "blogs"
        // WHERE "name" ILIKE $1`;

        const resultCount = await this.dataSource
            .getRepository(Blog)
            .createQueryBuilder('b')
            .select('COUNT(b.id)', 'count')
            .where('b.name ILIKE :searchNameTerm', { searchNameTerm: `%${pagination.searchNameTerm}%` })
            .getRawOne();

        const totalCount = resultCount.count;

        const pagesCount: number = Math.ceil(+totalCount / pagination.pageSize);

        return {
            pagesCount: pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: +totalCount,
            items: findAllBlogs.map(
                (blog: BlogDbType): BlogsViewType => ({
                    id: blog.id,
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl,
                    createdAt: blog.createdAt,
                    isMembership: blog.isMembership,
                }),
            ),
        };
    }

    async readPostsByBlogId(
        blogId: string,
        pagination: QueryPaginationType,
        userId?: string | null,
    ): Promise<PaginationModels<PostViewType[]>> {
        //       const queryFilter = `
        // 			SELECT * FROM public.posts
        // 				WHERE "blogId" = $1
        // 					ORDER BY "${pagination.sortBy}" ${pagination.sortDirection}
        // 				  LIMIT ${pagination.pageSize} OFFSET ${(pagination.pageNumber - 1) * pagination.pageSize}
        // `;

        const findPostsForBlog = await this.dataSource.getRepository(Post).find({
            where: {
                blogId: blogId,
            },
            order: { [pagination.sortBy]: pagination.sortDirection },
            take: pagination.pageSize,
            skip: (pagination.pageNumber - 1) * pagination.pageSize,
        } as FindManyOptions<Post>);

        //       const countTotalCount = `
        // 	    SELECT count(id)
        // 		  FROM public.posts
        // 			WHERE "blogId" = $1
        // `;

        const totalPostsCount = await this.dataSource
            .getRepository(Post)
            .createQueryBuilder('p')
            .select('COUNT(p.id)', 'count')
            .where('p.blogId = :blogId', { blogId: blogId })
            .getRawOne();
        const totalCount: number = parseInt(totalPostsCount.count);
        // const items: PostViewType[] = findPostsForBlog.map((p: postDbType) => likesMapper(p, userId));
        const items: PostViewType[] = findPostsForBlog.map((p: postDbType) => ({
            id: p.id,
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            blogId: p.blogId,
            blogName: p.blogName,
            createdAt: p.createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: [],
            },
        }));
        console.log(items);
        const pagesCount = Math.ceil(totalCount / pagination.pageSize);

        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items,
        };
        //         const query = `WITH post_likes_view AS (
        //     SELECT
        //         "postId",
        //         "userId",
        //         "createdAt",
        //         status,
        //         ROW_NUMBER() OVER (PARTITION BY "postId" ORDER BY "createdAt" DESC) AS rn
        //     FROM post_likes
        // )
        // SELECT
        //     p.id,
        //     p.title,
        //     p."shortDescription",
        //     p.content,
        //     p."blogId",
        //     p."blogName",
        //     p."createdAt",
        //      JSON_BUILD_OBJECT
        //     ('likesCount',  (SELECT COUNT(*) FROM post_likes
        //                     WHERE "status" = 'Like' AND "postId" = p.id),
        //      'dislikesCount',(SELECT COUNT(*) FROM post_likes
        //                     WHERE "status" = 'Dislike' AND "postId" =p.id),
        //     'myStatus', COALESCE((SELECT l2.status FROM post_likes l2 WHERE l2."postId" = p.id AND l2."userId" = $2 LIMIT 1), 'None'),
        //     'newestLikes', COALESCE(JSON_AGG(
        //         json_build_object(
        //             'addedAt', pl."createdAt",
        //             'userId', pl."userId",
        //             'login', u.login
        //         ) ORDER BY pl."createdAt" DESC
        //     ) FILTER (WHERE pl.rn IS NOT NULL  AND pl.status = 'Like'), '[]'::json)) AS "extendedLikesInfo"
        // FROM posts p
        // LEFT JOIN post_likes_view pl ON p.id = pl."postId" AND pl.rn <= 3
        // LEFT JOIN users u ON pl."userId" = u.id
        // LEFT JOIN (
        //     SELECT "postId", status
        //     FROM post_likes
        //     WHERE "userId" = $2
        // ) myLikes ON p.id = myLikes."postId"
        // WHERE "blogId" = $1
        // GROUP BY p.id
        // ORDER BY "${pagination.sortBy}" ${pagination.sortDirection}
        // LIMIT ${pagination.pageSize} offset ${(pagination.pageNumber - 1) * pagination.pageSize}`;
        //
        //         const queryCount = `SELECT count(id) FROM public.posts
        //                             WHERE "blogId" = $1`;
        //
        //         const totalPostCount = await this.dataSource.query(queryCount, [blogId]);
        //         const totalCount = parseInt(totalPostCount[0].count);
        //
        //         const pagesCount = Math.ceil(totalCount / pagination.pageSize);
        //         const view = await this.dataSource.query(query, [blogId, userId]);
        //
        //         return {
        //             pagesCount: pagesCount === 0 ? 1 : pagesCount,
        //             page: pagination.pageNumber,
        //             pageSize: pagination.pageSize,
        //             totalCount,
        //             items: view,
        //         };
    }

    async readBlogsById(id: string): Promise<Blog | null> {
        // const query = `SELECT * FROM public.blogs
        //                 WHERE id = $1`;
        // const blog = await this.dataSource.getRepository(Blog).findOne({ where: { id: id } });
        const blog = await this.dataSource
            .getRepository(Blog)
            .createQueryBuilder('blog')
            .select('blog.*')

            .where('id=:id', { id: id })
            .getRawOne();
        // return Object.keys(blog).reduce((obj, key) => {
        //     // Убираем префикс "blog_"
        //     const trimmedKey = key.replace('blog_', '');
        //
        //     // Добавляем свойство с новым именем в новый объект
        //     obj[trimmedKey] = blog[key];
        //
        //     return obj;
        // }, {} as Blog);
        return blog;
    }
}

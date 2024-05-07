import { PostType, UpdatePostForBlogDto } from '../api/models/input/post-input.model';
import { likeTypePost, PostViewType } from '../api/models/output/post-output.model';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Post, postDbType } from '../domain/post.entity';

@Injectable()
export class PostRepository {
    constructor(private dataSource: DataSource) {}

    async readPostId(postId: string): Promise<postDbType | null> {
        // const query = `SELECT * FROM public.posts
        //              WHERE id = $1`;
        const post = await this.dataSource.getRepository(Post).findOne({ where: { id: postId } });
        return post;
    }

    async createPost(newPost: PostType): Promise<PostViewType> {
        // const query = `INSERT INTO public.posts(
        //                 title, "shortDescription", content, "blogId", "blogName", "createdAt")
        //                 VALUES ($1, $2, $3, $4, $5, $6)
        //                 returning *;`;

        const post = await this.dataSource.getRepository(Post).create({
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt,
        });

        const savedPost = await this.dataSource.getRepository(Post).save(post);
        return PostType.toVievModel(savedPost);
    }

    async updatePosts(postId: string, blogId: string, newUpdateRequest: UpdatePostForBlogDto): Promise<boolean> {
        // const query = `UPDATE public.posts
        //                 SET title=$1, "shortDescription"=$2, content=$3, "blogId"=$4
        //                 WHERE id = $5;`;
        await this.dataSource.getRepository(Post).update(
            { id: postId },
            {
                title: newUpdateRequest.title,
                shortDescription: newUpdateRequest.shortDescription,
                content: newUpdateRequest.content,
            },
        );
        return true;
    }

    async updatePostReaction(likes: likeTypePost) {
        const query = `UPDATE public.post_likes
                     SET  "userId"=$1, "createdAt"=$2, status=$3
                     WHERE "postId"=$4;`;

        return await this.dataSource.query(query, [likes.userId, likes.createdAt, likes.status, likes.postId]);
    }

    async createLikeByPost(likes: likeTypePost) {
        const query = `INSERT INTO public.post_likes( "userId", "createdAt", status, "postId")
        VALUES ($1, $2, $3, $4)
        returning *`;

        return await this.dataSource.query(query, [likes.userId, likes.createdAt, likes.status, likes.postId]);
    }

    async readLikesPostId(postId: string, userId: string): Promise<postDbType | null> {
        const query = `SELECT * FROM public.post_likes
                     WHERE "postId" = $1 AND  "userId" = $2`;
        const like = await this.dataSource.query(query, [postId, userId]);

        if (!like) return null;
        return like[0];
    }

    async deletePosts(postId: string): Promise<boolean> {
        // const query = `DELETE FROM public.posts
        //                 WHERE id = $1`;

        const deleted = await this.dataSource
            .getRepository(Post)
            .createQueryBuilder()
            .delete()
            .from(Post)
            .where('id = :id', { id: postId })
            .execute();

        if (!deleted) return false;
        return true;
    }
}

import { PostType, UpdatePostForBlogDto } from '../api/models/input/post-input.model';
import { likeTypePost, PostViewType } from '../api/models/output/post-output.model';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post, postDbType } from '../domain/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Post_likes } from '../domain/post.lilkes.entity';

@Injectable()
export class PostRepository {
    constructor(
        @InjectRepository(Post) public postRepository: Repository<Post>,
        @InjectRepository(Post_likes) public postLikesRepository: Repository<Post_likes>,
    ) {}

    async readPostId(postId: string): Promise<postDbType | null> {
        // const query = `SELECT * FROM public.posts
        //              WHERE id = $1`;
        const post = await this.postRepository.findOne({ where: { id: postId } });
        return post;
    }

    async createPost(newPost: PostType): Promise<PostViewType> {
        // const query = `INSERT INTO public.posts(
        //                 title, "shortDescription", content, "blogId", "blogName", "createdAt")
        //                 VALUES ($1, $2, $3, $4, $5, $6)
        //                 returning *;`;

        const post = await this.postRepository.create({
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt,
        });

        const savedPost = await this.postRepository.save(post);
        return PostType.toVievModel(savedPost);
    }

    async updatePosts(postId: string, blogId: string, newUpdateRequest: UpdatePostForBlogDto): Promise<boolean> {
        // const query = `UPDATE public.posts
        //                 SET title=$1, "shortDescription"=$2, content=$3, "blogId"=$4
        //                 WHERE id = $5;`;
        await this.postRepository.update(
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
        // const query = `UPDATE public.post_likes
        //              SET  "userId"=$1, "createdAt"=$2, status=$3
        //              WHERE "postId"=$4;`;

        return await this.postLikesRepository.update(
            { userId: likes.userId, postId: likes.postId },
            {
                status: likes.status,
            },
        );
    }

    async createLikeByPost(likes: likeTypePost) {
        // const query = `INSERT INTO public.post_likes( "userId", "createdAt", status, "postId")
        // VALUES ($1, $2, $3, $4)
        // returning *`;

        return await this.postLikesRepository.save(likes);
    }

    async readLikesPostId(postId: string, userId: string): Promise<Post_likes | null> {
        // const query = `SELECT * FROM public.post_likes
        //              WHERE "postId" = $1 AND  "userId" = $2`;
        const like = await this.postLikesRepository
            .createQueryBuilder('pl')
            .where('pl.postId = :postId', { postId })
            .andWhere('pl.userId = :userId', { userId })
            .getOne();
        console.log(like);

        if (!like) return null;
        return like;
    }

    async deletePosts(postId: string): Promise<boolean> {
        // const query = `DELETE FROM public.posts
        //                 WHERE id = $1`;

        const deleted = await this.postRepository
            .createQueryBuilder()
            .delete()
            .from(Post)
            .where('id = :id', { id: postId })
            .execute();

        if (!deleted) return false;
        return true;
    }
}

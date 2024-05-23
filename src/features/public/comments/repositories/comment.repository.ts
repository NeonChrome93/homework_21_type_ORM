import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Comments, CommentsDBType } from '../domain/comment.entity';
import { likeTypeComment, UpdateCommentDto } from '../api/models/input/comment.input.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments_likes } from '../domain/comments.likes.entity';

@Injectable()
export class CommentRepository {
    constructor(
        @InjectRepository(Comments) public commentRepository: Repository<Comments>,
        @InjectRepository(Comments_likes) public likesRepository: Repository<Comments_likes>,
    ) {}

    async createComment(newComment: CommentsDBType) {
        // const comment = await this.dataSource.query(
        //     `INSERT INTO public.comments( "postId", content, "userId", "createdAt")
        //                 VALUES ($1, $2, $3, $4)
        //                 returning id;`,
        //     [newComment.postId, newComment.content, newComment.userId, newComment.createdAt],
        // );
        const comment = await this.commentRepository.create({
            postId: newComment.postId,
            content: newComment.content,
            userId: newComment.userId,
            createdAt: newComment.createdAt,
        });
        const savedComment = await this.commentRepository.save(comment);

        return savedComment.id;
    }

    async createLikeByComment(likes: likeTypeComment) {
        // const query = `INSERT INTO public.comments_likes( "userId", "createdAt", status, "commentId")
        // VALUES ($1, $2, $3, $4)
        // returning *`;

        return await this.likesRepository.save(likes);
    }

    async updateComment(commentId: string, newUpdateRequest: UpdateCommentDto): Promise<boolean> {
        // const query = `UPDATE public.comments
        //                 SET "content"  = $1
        //                 WHERE id = $2`;

        const updated = await this.commentRepository.update(
            { id: commentId },
            {
                content: newUpdateRequest.content,
            },
        );
        if (!updated) return false;
        return true;
    }

    async readLikesCommentId(commentId: string, userId: string): Promise<Comments_likes | null> {
        // const query = `SELECT * FROM public.comments_likes
        //              WHERE "commentId" = $1 AND  "userId" = $2`;
        const like = await this.likesRepository
            .createQueryBuilder('likes_comment')
            .where('likes_comment.commentId = :commentId', { commentId })
            .andWhere('likes_comment.userId = :userId', { userId })
            .getOne();
        if (!like) return null;
        return like;
    }

    async deleteComment(commentId: string): Promise<boolean> {
        const deleted = await this.commentRepository
            .createQueryBuilder()
            .delete()
            .from(Comments)
            .where('id = :commentId', { commentId })
            .execute();
        if (!deleted) return false;
        return true;
    }

    async updateCommentReactions(likes: { id: string } & likeTypeComment) {
        // const query = `UPDATE public.comments_likes
        //              SET  "userId"=$1, "createdAt"=$2, status=$3
        //              WHERE "commentId"=$4;`;

        //const commentById = await this.likesRepository.findOne({ where: { id: likes.commentId } });

        return await this.likesRepository.update(
            { id: likes.id },
            {
                userId: likes.userId,
                createdAt: likes.createdAt,
                status: likes.status,
            },
        );
    }
}

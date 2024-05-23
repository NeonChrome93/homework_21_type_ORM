import { Module } from '@nestjs/common';
import { CommentController } from './api/comment.controller';
import { CommentRepository } from './repositories/comment.repository';
import { CommentsQueryRepository } from './repositories/comment.query.repository';
import { CreateCommentUseCase } from './application/usecases/create-comment.usecase';
import { UpdateCommentUseCase } from './application/usecases/update-comment.usecase';
import { AddReactionUseCase } from './application/usecases/add-reaction.usecase';
import { DeleteCommentUseCase } from './application/usecases/delete-comment.usecase';
import { AuthModule } from '../../admin/users/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from './domain/comment.entity';
import { Comments_likes } from './domain/comments.likes.entity';

const repository = [CommentRepository, CommentsQueryRepository];
const useCases = [CreateCommentUseCase, UpdateCommentUseCase, AddReactionUseCase, DeleteCommentUseCase];

@Module({
    imports: [CqrsModule, AuthModule, TypeOrmModule.forFeature([Comments, Comments_likes])],
    providers: [...repository, ...useCases],
    controllers: [CommentController],
    exports: [CommentsQueryRepository],
})
export class CommentsModule {}

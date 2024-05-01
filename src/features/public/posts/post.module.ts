import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './domain/post.entity';
import { PostController } from './api/post.controller';
import { CreateBlogUseCase } from '../../admin/blogs/application/usecases/create-blog.usecase';
import { DeleteBlogUseCase } from '../../admin/blogs/application/usecases/delete-blog-usecase';
import { UpdateBlogUseCase } from '../../admin/blogs/application/usecases/update.blog.usecase';
import { UpdatePostUseCase } from './application/usecases/update-post.usecase';
import { AddLikesByPostUseCase } from './application/usecases/add-likes-by-post.usecase';
import { DeletePostUseCase } from './application/usecases/delete-post.usecase';
import { CreateCommentUseCase } from '../comments/application/usecases/create-comment.usecase';
import { UpdateCommentUseCase } from '../comments/application/usecases/update-comment.usecase';
import { AddReactionUseCase } from '../comments/application/usecases/add-reaction.usecase';
import { DeleteCommentUseCase } from '../comments/application/usecases/delete-comment.usecase';
import { PostService } from './application/post.service';
import { BlogRepository } from '../../admin/blogs/repositories/blog.repository';
import { BlogQueryRepository } from '../../admin/blogs/repositories/blog.query.repository';
import { PostsQueryRepository } from './repositories/post.query.repository';
import { PostRepository } from './repositories/post.repository';
import { CommentRepository } from '../comments/repositories/comment.repository';
import { CommentsQueryRepository } from '../comments/repositories/comment.query.repository';
import { UserRepository } from '../../admin/users/repositories/user-repository';

const repository = [BlogRepository, PostsQueryRepository, PostRepository];

const useCases = [UpdatePostUseCase, AddLikesByPostUseCase, DeletePostUseCase];

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([Post])],
    providers: [PostService, ...useCases, ...repository],
    controllers: [PostController],
})
export class PostModule {}

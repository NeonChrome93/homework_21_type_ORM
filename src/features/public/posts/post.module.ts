import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './domain/post.entity';
import { PostController } from './api/post.controller';
import { UpdatePostUseCase } from './application/usecases/update-post.usecase';
import { AddLikesByPostUseCase } from './application/usecases/add-likes-by-post.usecase';
import { DeletePostUseCase } from './application/usecases/delete-post.usecase';

import { PostService } from './application/post.service';
import { BlogRepository } from '../../admin/blogs/repositories/blog.repository';

import { PostsQueryRepository } from './repositories/post.query.repository';
import { PostRepository } from './repositories/post.repository';
import { CreatePostUseCase } from './application/usecases/create-post.usecase';
import { AuthModule } from '../../admin/users/auth.module';
import { CommentsModule } from '../comments/comments.module';
import { Post_likes } from './domain/post.lilkes.entity';
import { Blog } from '../../admin/blogs/domain/blog.entity';
import { IsBlogExistConstraint } from '../../../infrastructure/decorators/blog-exist.decorator';

const repository = [PostsQueryRepository, PostRepository, BlogRepository];

const useCases = [CreatePostUseCase, UpdatePostUseCase, AddLikesByPostUseCase, DeletePostUseCase];

@Module({
    imports: [CqrsModule, AuthModule, CommentsModule, TypeOrmModule.forFeature([Post, Post_likes, Blog])],
    providers: [PostService, ...useCases, ...repository, IsBlogExistConstraint],
    controllers: [PostController],
    exports: [PostService, PostRepository],
})
export class PostModule {}

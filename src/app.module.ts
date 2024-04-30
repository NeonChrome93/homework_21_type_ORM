import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserRepository } from './features/admin/users/repositories/user-repository';

import { CqrsModule } from '@nestjs/cqrs';

import { PassportModule } from '@nestjs/passport';

import { UserService } from './features/admin/users/application/user.service';
import { JwtAdapter } from './features/public/auth/adapters/jwt.adapter';

import { ThrottlerModule } from '@nestjs/throttler';

import { DelController } from './testing-all-data/testing.controller';

import { ConfigModule } from '@nestjs/config';

import { BlogSaController } from './features/admin/blogs/api/blog.sa.controller';
import { CreateBlogUseCase } from './features/admin/blogs/application/usecases/create-blog.usecase';
import { BlogRepository } from './features/admin/blogs/repositories/blog.repository';
import { DeleteBlogUseCase } from './features/admin/blogs/application/usecases/delete-blog-usecase';
import { UpdateBlogUseCase } from './features/admin/blogs/application/usecases/update.blog.usecase';
import { BlogQueryRepository } from './features/admin/blogs/repositories/blog.query.repository';
import { BlogController } from './features/public/blogs/api/blog.controller';
import { PostController } from './features/public/posts/api/post.controller';
import { PostService } from './features/public/posts/application/post.service';
import { PostRepository } from './features/public/posts/repositories/post.repository';
import { PostsQueryRepository } from './features/public/posts/repositories/post.query.repository';
import { UpdatePostUseCase } from './features/public/posts/application/usecases/update-post.usecase';
import { AddLikesByPostUseCase } from './features/public/posts/application/usecases/add-likes-by-post.usecase';
import { DeletePostUseCase } from './features/public/posts/application/usecases/delete-post.usecase';
import { CreateCommentUseCase } from './features/public/comments/application/usecases/create-comment.usecase';
import { CommentRepository } from './features/public/comments/repositories/comment.repository';
import { CommentsQueryRepository } from './features/public/comments/repositories/comment.query.repository';
import { CommentController } from './features/public/comments/api/comment.controller';
import { UpdateCommentUseCase } from './features/public/comments/application/usecases/update-comment.usecase';
import { AddReactionUseCase } from './features/public/comments/application/usecases/add-reaction.usecase';
import { DeleteCommentUseCase } from './features/public/comments/application/usecases/delete-comment.usecase';
import { AuthModule } from './features/admin/users/authModule';
import { Blog } from './features/admin/blogs/domain/blog.entity';

const repository = [
    BlogRepository,
    BlogQueryRepository,
    PostsQueryRepository,
    PostRepository,
    CommentRepository,
    CommentsQueryRepository,
    UserRepository,
];
const useCases = [
    CreateBlogUseCase,
    DeleteBlogUseCase,
    UpdateBlogUseCase,
    UpdatePostUseCase,
    AddLikesByPostUseCase,
    DeletePostUseCase,
    CreateCommentUseCase,
    UpdateCommentUseCase,
    AddReactionUseCase,
    DeleteCommentUseCase,
];

export const options: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'necron23',
    database: 'blogs-posts-ORM',
    entities: [],
    autoLoadEntities: true,
    synchronize: true,
};

@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 10000,
                limit: 5,
            },
        ]),
        TypeOrmModule.forRoot(options),
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forFeature([Blog]),
        CqrsModule,

        PassportModule,
        AuthModule,
        // смотреть видео о переменных окружения
        //разнести на модули пока будет время
    ],
    controllers: [AppController, DelController, BlogSaController, BlogController, PostController, CommentController],
    providers: [AppService, PostService, UserService, JwtAdapter, ...useCases, ...repository],
})
export class AppModule {}

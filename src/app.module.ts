import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './features/admin/users/api/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './features/admin/users/repositories/user-repository';
import { DeleteUserUseCase } from './features/admin/users/application/usecases/delete-user.command';
import { CreateUserCommand, CreateUserUseCase } from './features/admin/users/application/usecases/create-user.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersQueryRepository } from './features/admin/users/repositories/user.query.repository';
import { AuthController } from './features/public/auth/api/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './features/public/auth/application/local.strategy';
import { UserService } from './features/admin/users/application/user.service';
import { JwtAdapter } from './features/public/auth/adapters/jwt.adapter';
import { EmailAdapter } from './features/public/auth/adapters/email.adapter';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthService } from './features/public/auth/application/auth.service';
import { ConfirmEmailUseCase } from './features/public/auth/application/usecases/confirm-email.usecase';
import { ResendingCodeUseCase } from './features/public/auth/application/usecases/resending-code.usecase';
import { RegistrationUserUseCase } from './features/public/auth/application/usecases/registration-user.usecase';
import { NewPasswordSetUseCase } from './features/public/auth/application/usecases/new-password-set.usecase';
import { AuthLoginUseCase } from './features/public/auth/application/usecases/auth-login.usecase';
import { PasswordRecoveryUseCase } from './features/public/auth/application/usecases/password-recovery.usecase';
import { CreateDeviceUseCase } from './features/public/devices/application/usecases/create-device.usecase';
import { DeleteDeviceUseCase } from './features/public/devices/application/usecases/delete-device.usecase';
import { DevicesRepository } from './features/public/devices/repositories/device.repository';
import { DevicesService } from './features/public/devices/application/device.service';
import { DevicesQueryRepository } from './features/public/devices/repositories/device.query.repository';
import { DelController } from './testing-all-data/testing.controller';
import { IsUserAlreadyExistConstraint } from './infrastructure/decorators/user-exist.decorator';
import { RegistrationConfirmCodeConstraint } from './infrastructure/decorators/registration-conformation.decorator';
import { RegistrationEmailResendingConstraint } from './infrastructure/decorators/registration-email-resending.decorator';
import { ConfigModule } from '@nestjs/config';
import { DeviceController } from './features/public/devices/api/device.controller';
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
import { User } from './features/admin/users/domain/user.entity';
import { Device } from './features/public/devices/domain/device.entity';

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

@Module({
    imports: [
        // ThrottlerModule.forRoot([
        //     {
        //         ttl: 10000,
        //         limit: 5,
        //     },
        // ]),

        ConfigModule.forRoot({ isGlobal: true }),
        CqrsModule,
        PassportModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'necron23',
            database: 'blogs-posts-ORM',
            entities: [],
            autoLoadEntities: true,
            synchronize: true,
        }),
        AuthModule,
        // смотреть видео о переменных окружения
        //разнести на модули пока будет время
    ],
    controllers: [AppController, DelController, BlogSaController, BlogController, PostController, CommentController],
    providers: [AppService, PostService, UserService, JwtAdapter, ...useCases, ...repository],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/blog.entity';
import { BlogRepository } from './repositories/blog.repository';
import { BlogQueryRepository } from './repositories/blog.query.repository';
import { CreateBlogUseCase } from './application/usecases/create-blog.usecase';
import { DeleteBlogUseCase } from './application/usecases/delete-blog-usecase';
import { UpdateBlogUseCase } from './application/usecases/update.blog.usecase';
import { BlogSaController } from './api/blog.sa.controller';
import { BlogController } from '../../public/blogs/api/blog.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../users/auth.module';
import { PostModule } from '../../public/posts/post.module';

const useCases = [CreateBlogUseCase, DeleteBlogUseCase, UpdateBlogUseCase];
@Module({
    imports: [CqrsModule, AuthModule, PostModule, TypeOrmModule.forFeature([Blog])],
    providers: [BlogRepository, BlogQueryRepository, ...useCases],
    controllers: [BlogSaController, BlogController],
    exports: [],
})
export class BlogModule {}

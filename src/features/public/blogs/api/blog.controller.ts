import { Controller, Get, NotFoundException, Param, Query, UseGuards } from '@nestjs/common';
import { BlogsQueryType } from './models/input/blog.input.model';
import { CommandBus } from '@nestjs/cqrs';
import { BlogQueryRepository } from '../../../admin/blogs/repositories/blog.query.repository';
import { getQueryPagination, QueryPaginationType } from '../../../../utils/pagination';
import { EnhancedParseUUIDPipe } from '../../../../infrastructure/exceptions/parse_UUID.pipe.';
import { SoftBearerAuthGuard } from '../../../../infrastructure/guards/user.guard';
import { UserId } from '../../../../infrastructure/decorators/get-user.decorator';

@Controller('blogs')
export class BlogController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly blogQueryRepository: BlogQueryRepository,
    ) {}

    @Get()
    async GetBlogsPublic(@Query() queryDto: BlogsQueryType) {
        const pagination = getQueryPagination(queryDto);
        const blogs = await this.blogQueryRepository.readBlogs(pagination);
        return blogs;
    }

    @Get(':id')
    async GetBlogByIdPublic(@Param('id', EnhancedParseUUIDPipe) id: string) {
        const blog = await this.blogQueryRepository.readBlogsById(id);
        if (!blog) {
            throw new NotFoundException('blog with id not found');
        } else return blog;
    }

    @Get(':blogId/posts')
    @UseGuards(SoftBearerAuthGuard)
    async GetPostsForBlogPublic(
        @UserId() userId: string | null,
        @Param('blogId') blogId: string,
        @Query() queryDto: QueryPaginationType,
    ) {
        const pagination = getQueryPagination(queryDto);
        const blog = await this.blogQueryRepository.readBlogsById(blogId);
        if (!blog) throw new NotFoundException('Blog with this id not found');
        const posts = await this.blogQueryRepository.readPostsByBlogId(blogId, pagination, userId);
        return posts;
    }
}

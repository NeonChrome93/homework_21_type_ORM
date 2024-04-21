import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
//import { BlogQueryRepository } from '../repositories/blog.query.repository';
import { BlogRepository } from '../repositories/blog.repository';
import { BlogsQueryType, CreateBlogDto, UpdateBlogTypeDto } from './models/input/blog.input.model';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { DeleteBlogCommand } from '../application/usecases/delete-blog-usecase';
import { UpdateBlogCommand } from '../application/usecases/update.blog.usecase';
import { getQueryPagination } from '../../../../utils/pagination';
import { BasicAuthGuard } from '../../../../infrastructure/guards/basic-auth.guard';
import { SoftBearerAuthGuard } from '../../../../infrastructure/guards/user.guard';
import { UserId } from '../../../../infrastructure/decorators/get-user.decorator';
import { BlogQueryRepository } from '../repositories/blog.query.repository';
import { createPostByBlogIdDto, UpdatePostForBlogDto } from '../../../public/posts/api/models/input/post-input.model';
import { PostService } from '../../../public/posts/application/post.service';
import { EnhancedParseUUIDPipe } from '../../../../infrastructure/exceptions/parse_UUID.pipe.';
import { UpdatePostCommand } from '../../../public/posts/application/usecases/update-post.usecase';
import { DeletePostCommand } from '../../../public/posts/application/usecases/delete-post.usecase';

@Controller('sa/blogs')
export class BlogSaController {
    constructor(
        private readonly blogQueryRepository: BlogQueryRepository,
        private commandBus: CommandBus,
        private readonly postService: PostService,
        private readonly blogRepository: BlogRepository,
    ) {}

    @Get() //Get All Blogs
    @UseGuards(BasicAuthGuard)
    async getBlogs(@Query() queryDto: BlogsQueryType) {
        const pagination = getQueryPagination(queryDto);
        const view = await this.blogQueryRepository.readBlogs(pagination);
        return view;
    }

    @Get(':id') //Get Blog Id
    @UseGuards(BasicAuthGuard)
    async getBlogById(@Param('id') id: string) {
        //const blogId = req.params.id
        const foundId = await this.blogQueryRepository.readBlogsById(id);
        if (!foundId) {
            throw new NotFoundException('Blog with this id not found');
        }
        return foundId;
    }

    @Post() //Create Blog
    @HttpCode(201)
    @UseGuards(BasicAuthGuard)
    async createBlog(@Body() blogDto: CreateBlogDto) {
        const newBlog = await this.commandBus.execute(new CreateBlogCommand(blogDto));
        return newBlog;
    }

    @Put(':id') //Update Blog By Id
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    async updateBlog(@Param('id') id: string, @Body() blogDto: UpdateBlogTypeDto) {
        const blogUpdate = await this.commandBus.execute(new UpdateBlogCommand(id, blogDto));
        if (blogUpdate) {
            return blogUpdate;
        } else throw new NotFoundException('Blog with this id not found');
    }

    @Put(':blogId/posts/:postId') //Update post for current blog
    @UseGuards(SoftBearerAuthGuard)
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    async updatePostForBlog(
        @Param('blogId') blogId: string,
        @Param('postId') postId: string,
        @Request() req: Request,
        @Body() postDto: UpdatePostForBlogDto,
    ) {
        const blog = await this.blogRepository.readBlogsId(blogId);
        if (!blog) throw new NotFoundException('Blog with this id not found');
        const postUpdate = await this.commandBus.execute(new UpdatePostCommand(postId, blogId, postDto));
        //console.log(postUpdate);
        if (postUpdate) {
            return postUpdate;
        } else throw new NotFoundException('Post with this id not found');
    }

    @Get(':blogId/posts') //Get Posts By Blog Id
    @UseGuards(SoftBearerAuthGuard)
    @UseGuards(BasicAuthGuard)
    async getPostByBlogId(
        @Param('blogId') blogId: string,
        @Request() req: Request,
        @Query() queryDto: BlogsQueryType,
        @UserId() userId: string,
    ) {
        const pagination = getQueryPagination(queryDto);
        const blog = await this.blogRepository.readBlogsId(blogId);
        if (!blog) throw new NotFoundException('Blog with this id not found');
        const view = await this.blogQueryRepository.readPostsByBlogId(blogId, pagination, userId); //servis
        return view;
    }

    @Post(':blogId/posts') //Create Post By Blog Id
    @HttpCode(201)
    @UseGuards(BasicAuthGuard)
    async createPostByBlogId(
        @Param('blogId', EnhancedParseUUIDPipe) blogId: string,
        @Body() postDto: createPostByBlogIdDto,
    ) {
        const post = await this.postService.createPost({ ...postDto, blogId });
        if (!post) throw new NotFoundException('Blog with this id not found');
        return post;
    }

    @Delete(':blogId/posts/:postId') //Update post for current blog
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    async deletePostForBlog(@Param('blogId') blogId: string, @Param('postId') postId: string) {
        const blog = await this.blogRepository.readBlogsId(blogId);
        if (!blog) throw new NotFoundException('Blog with this id not found');
        const isDeleted = await this.commandBus.execute(new DeletePostCommand(postId));
        if (isDeleted) {
            return isDeleted;
        } else throw new NotFoundException('Blog with this id not found');
    }

    @Delete(':id') //Delete Blog By Id
    @UseGuards(BasicAuthGuard)
    @HttpCode(204)
    async deleteBlog(@Param('id') id: string) {
        const isDeleted = await this.commandBus.execute(new DeleteBlogCommand(id));
        if (isDeleted) {
            return isDeleted;
        } else throw new NotFoundException('Blog with this id not found');
    }
}

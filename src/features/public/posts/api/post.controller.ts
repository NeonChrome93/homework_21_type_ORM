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
    UseGuards,
} from '@nestjs/common';

import { PostsQueryRepository } from '../repositories/post.query.repository';
import { PostService } from '../application/post.service';
import { PostRepository } from '../repositories/post.repository';
import { CommandBus } from '@nestjs/cqrs';
import { DeletePostCommand } from '../application/usecases/delete-post.usecase';
import { AddLikesByPostCommand } from '../application/usecases/add-likes-by-post.usecase';
import { PostsQueryType } from './models/output/post-output.model';
import { createPostDto, likesDto } from './models/input/post-input.model';
import { BearerAuthGuard, SoftBearerAuthGuard } from '../../../../infrastructure/guards/user.guard';
import { UserAll, UserId } from '../../../../infrastructure/decorators/get-user.decorator';
import { getQueryPagination } from '../../../../utils/pagination';
import { BasicAuthGuard } from '../../../../infrastructure/guards/basic-auth.guard';
import { CommentsQueryRepository } from '../../comments/repositories/comment.query.repository';
import { UpdateCommentDto } from '../../comments/api/models/input/comment.input.model';
import { User } from '../../../admin/users/domain/user.entity';
import { CreateCommentCommand } from '../../comments/application/usecases/create-comment.usecase';

@Controller('posts')
export class PostController {
    constructor(
        private readonly postsQueryRepository: PostsQueryRepository,
        private readonly postService: PostService,
        private commandBus: CommandBus,
        private readonly postRepository: PostRepository,
        private readonly commentQueryRepository: CommentsQueryRepository,
    ) {}

    @Get() //Return All Posts
    @UseGuards(SoftBearerAuthGuard)
    async getPosts(@Query() queryDto: PostsQueryType, @UserId() userId: string | null) {
        const pagination = getQueryPagination(queryDto);
        const posts = await this.postsQueryRepository.readPosts(pagination, userId);
        return posts;
    }

    @Get(':id') //Return Post By id
    @UseGuards(SoftBearerAuthGuard)
    async getPostById(@Param('id') postId: string, @UserId() userId: string | null) {
        const post = await this.postsQueryRepository.readPostId(postId, userId);
        if (!post) {
            throw new NotFoundException('Post with this id not found');
        }
        return post;
    }

    @Post() //Not This
    @HttpCode(201)
    @UseGuards(BasicAuthGuard)
    async createPosts(@Body() postDto: createPostDto) {
        const newPost = await this.postService.createPost(postDto);
        return newPost;
    }

    // @Put(':id') //Not This
    // @HttpCode(204)
    // @UseGuards(BasicAuthGuard)
    // async updatePost(@Param('id') postId: string, @Body() postDto: UpdatePostDto) {
    //     const postUpdate = await this.commandBus.execute(new UpdatePostCommand(postId, postDto));
    //     if (postUpdate) {
    //         return postUpdate;
    //     } else throw new NotFoundException('Post with this id not found');
    // }

    @Delete(':id') //Not This
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    async deletePost(@Param('id') postId: string) {
        const isDeleted = await this.commandBus.execute(new DeletePostCommand(postId));
        if (isDeleted) {
            return isDeleted;
        } else throw new NotFoundException('Blog with this id not found');
    }

    @Get(':postId/comments') //Read Comments By Spec Post
    @UseGuards(SoftBearerAuthGuard)
    async getCommentByPostId(
        @Query() queryDto: PostsQueryType,
        @Param('postId') postId: string,
        @UserId() userId: string | null,
    ) {
        //const userId = req.userId
        const pagination = getQueryPagination(queryDto);
        const post = await this.postRepository.readPostId(postId);
        if (!post) {
            throw new NotFoundException();
        }
        const comment = await this.commentQueryRepository.readCommentByPostId(postId, pagination, userId);
        if (!comment) throw new NotFoundException();
        else return comment;
    }

    @Post(':postId/comments') //Create NewComment
    @UseGuards(BearerAuthGuard)
    async createCommentByPostId(@Param('postId') postId: string, @Body() dto: UpdateCommentDto, @UserAll() user: User) {
        const post = await this.postRepository.readPostId(postId);
        if (!post) throw new NotFoundException();

        const userId = user!.id.toString();
        const userLogin = user!.login;
        const newComment = await this.commandBus.execute(
            new CreateCommentCommand(post.id.toString(), userId, userLogin, dto.content),
        );
        return newComment;
    }

    @Put(':postId/like-status') //Update LikeStatus
    @HttpCode(204)
    @UseGuards(BearerAuthGuard)
    async updateLikeStatus(@Param('postId') postId: string, @Body() body: likesDto, @UserId() userId: string) {
        const post = await this.postRepository.readPostId(postId);
        if (!post) throw new NotFoundException('Post with this id not found');
        const addLikes = await this.commandBus.execute(new AddLikesByPostCommand(postId, userId, body.likeStatus));
        if (!addLikes) {
            throw new NotFoundException();
        }
        return addLikes;
    }
}

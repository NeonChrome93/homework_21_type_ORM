import { Injectable } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { createPostDto, PostType } from '../api/models/input/post-input.model';
import { PostViewType } from '../api/models/output/post-output.model';
import { BlogRepository } from '../../../admin/blogs/repositories/blog.repository';

@Injectable()
export class PostService {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly blogRepository: BlogRepository,
    ) {}

    async createPost(inputDto: createPostDto): Promise<PostViewType | null> {
        const blog = await this.blogRepository.readBlogsId(inputDto.blogId);
        if (!blog) return null;
        const newPost: PostType = {
            ...inputDto,
            blogName: blog.name,
            createdAt: new Date(),
        };
        return this.postRepository.createPost(newPost);
    }

    // async addLikesByPost(postId: string, userId: string, status: REACTIONS_ENUM): Promise<boolean> {
    //     let post = await this.postRepository.readPostId(postId)
    //     let user = await this.usersRepository.readUserById(userId.toString()) //login: user!.login
    //
    //     if (!post) return false
    //     const reactions = post.reactions.find(r => r.userId == userId)
    //
    //     if (!reactions) {
    //
    //         post.reactions.push({ userId, status, createdAt: new Date(), login: user!.login})
    //     } else {
    //         //reactions.userId = userId
    //         reactions.createdAt = new Date()
    //         reactions.status = status
    //         post.reactions.map((r) => r.userId === userId ? {...r, ...reactions} : r )
    //         // Таким образом, строка кода обновляет массив реакций комментария,
    //         //     заменяя существующую реакцию пользователя на новую реакцию, если идентификаторы пользователей совпадают.
    //
    //     }
    //     await this.postRepository.updatePostReaction(post)
    //     return true
    // }
}

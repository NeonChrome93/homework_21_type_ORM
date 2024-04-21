import { PostRepository } from '../../repositories/post.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostDto, UpdatePostForBlogDto } from '../../api/models/input/post-input.model';

export class UpdatePostCommand {
    constructor(
        public postId: string,
        public blogId: string,
        public newUpdateRequest: UpdatePostForBlogDto,
    ) {}
}
@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
    constructor(private readonly postRepository: PostRepository) {}
    async execute(command: UpdatePostCommand): Promise<boolean> {
        const post = await this.postRepository.readPostId(command.postId);
        if (!post) return false;
        return this.postRepository.updatePosts(command.postId, command.blogId, command.newUpdateRequest);
    }
}

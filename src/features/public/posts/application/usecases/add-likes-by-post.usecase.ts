import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { REACTIONS_ENUM } from '../../../comments/api/models/output/comments.output.models';
import { PostRepository } from '../../repositories/post.repository';

export class AddLikesByPostCommand {
    constructor(
        public postId: string,
        public userId: string,
        public status: REACTIONS_ENUM,
    ) {}
}

@CommandHandler(AddLikesByPostCommand)
export class AddLikesByPostUseCase implements ICommandHandler<AddLikesByPostCommand> {
    constructor(private readonly postRepository: PostRepository) {}

    async execute(command: AddLikesByPostCommand): Promise<boolean> {
        console.log('commandDDDD', command);
        const post = await this.postRepository.readPostId(command.postId);
        if (!post) return false;

        const reactions = await this.postRepository.readLikesPostId(command.postId, command.userId);
        console.log({ reactions });
        if (!reactions) {
            await this.postRepository.createLikeByPost({
                userId: command.userId.toString(),
                createdAt: new Date().toISOString(),
                status: command.status,
                postId: command.postId.toString(),
            });
            // new LikesEntity INSERT INTO
            // post.reactions.push({
            //     userId: command.userId,
            //     login: user!.login,
            //     createdAt: new Date(),
            //     status: command.status,
            // });
        } else {
            await this.postRepository.updatePostReaction({
                userId: command.userId.toString(),
                createdAt: new Date().toISOString(),
                status: command.status,
                postId: command.postId.toString(),
            });
            //однократное обращение к репозиторию UPDATE
            // reactions.userId = userId
            // reactions.createdAt = new Date();
            // reactions.status = command.status;
            // post.reactions.map(r => (r.userId === command.userId ? { ...r, ...reactions } : r));
            // Таким образом, строка кода обновляет массив реакций комментария,
            //     заменяя существующую реакцию пользователя на новую реакцию, если идентификаторы пользователей совпадают.
        }

        return true;
    }
}

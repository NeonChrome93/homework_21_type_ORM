import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { REACTIONS_ENUM } from '../../api/models/output/comments.output.models';
import { CommentRepository } from '../../repositories/comment.repository';
import { CommentsQueryRepository } from '../../repositories/comment.query.repository';

export class AddReactionCommand {
    constructor(
        public commentId: string,
        public userId: string,
        public status: REACTIONS_ENUM,
    ) {}
}

@CommandHandler(AddReactionCommand)
export class AddReactionUseCase implements ICommandHandler<AddReactionCommand> {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly commentQueryRepository: CommentsQueryRepository,
    ) {}

    async execute(command: AddReactionCommand): Promise<boolean> {
        const comment = await this.commentQueryRepository.readCommentId(command.commentId);
        if (!comment) return false;

        const reaction = await this.commentRepository.readLikesCommentId(command.commentId, command.userId);

        if (!reaction) {
            await this.commentRepository.createLikeByComment({
                userId: command.userId.toString(),
                status: command.status,
                createdAt: new Date().toISOString(),
                commentId: command.commentId.toString(),
            });
        } else {
            await this.commentRepository.updateCommentReactions({
                userId: command.userId.toString(),
                status: command.status,
                createdAt: new Date().toISOString(),
                commentId: command.commentId.toString(),
            });
        }

        return true;
    }
}

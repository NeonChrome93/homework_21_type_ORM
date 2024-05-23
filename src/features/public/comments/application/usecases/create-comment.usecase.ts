import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../../repositories/comment.repository';
import { CommentsViewType } from '../../api/models/output/comments.output.models';
import { CommentsDBType } from '../../domain/comment.entity';
import { CommentsQueryRepository } from '../../repositories/comment.query.repository';

export class CreateCommentCommand {
    constructor(
        public postId: string,
        public userId: string,
        public userLogin: string,
        public content: string,
    ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand> {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly commentQueryRepository: CommentsQueryRepository,
    ) {}

    async execute(command: CreateCommentCommand): Promise<CommentsViewType> {
        const { postId, userId, content } = command;
        console.log('UserIdCCCC', userId);
        const newComment: CommentsDBType = {
            postId,
            content,
            userId,
            createdAt: new Date(),
        };
        console.log('A', newComment);
        const commentId = await this.commentRepository.createComment(newComment);
        console.log('B', commentId);
        const commentWithViev = await this.commentQueryRepository.readCommentId(commentId, userId);
        return commentWithViev;
    }
}

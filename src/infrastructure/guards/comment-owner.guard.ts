import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../../features/public/comments/repositories/comment.query.repository';
import { UserService } from '../../features/admin/users/application/user.service';
import { JwtAdapter } from '../../features/public/auth/adapters/jwt.adapter';
import { Request } from 'express';

@Injectable()
export class CommentOwnerGuard implements CanActivate {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtAdapter,
        private readonly commentsQueryRepository: CommentsQueryRepository,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        if (!request.headers.authorization) {
            throw new UnauthorizedException();
            return true;
        }

        const token = request.headers.authorization.split(' ')[1];
        const userId = await this.jwtService.getUserIdByToken(token);
        //console.log(request.params, 'param');
        const commentBeforeDelete = await this.commentsQueryRepository.readCommentId(request.params.commentId);
        // console.log(commentBeforeDelete, 'commentBeforeDelete');
        if (!commentBeforeDelete) {
            throw new NotFoundException();
        }

        if (!userId) {
            throw new NotFoundException();
        }

        const commentarorId = commentBeforeDelete.commentatorInfo.userId;
        if (commentarorId !== userId.toString()) {
            throw new ForbiddenException();
        } else {
            return true;
        }
    }
}

import { IsIn, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { REACTIONS_ENUM } from '../output/comments.output.models';
import { Trim } from '../../../../../../infrastructure/validation/custom';

export class UpdateCommentDto {
    @MaxLength(300)
    @MinLength(20)
    @Trim()
    @IsString()
    @IsNotEmpty()
    content: string;
}

export type likeTypeComment = {
    userId: string;
    createdAt: string;
    status: REACTIONS_ENUM;
    commentId: string;
};

export class updateLikeDto {
    @IsIn(Object.values(REACTIONS_ENUM))
    likeStatus: REACTIONS_ENUM;
}

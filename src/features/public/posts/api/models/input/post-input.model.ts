import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Trim } from '../../../../../../infrastructure/validation/custom';
import { REACTIONS_ENUM } from '../../../../comments/api/models/output/comments.output.models';
import { PostViewType } from '../output/post-output.model';
import { IsBlogExist } from '../../../../../../infrastructure/decorators/blog-exist.decorator';

export class createPostDto {
    @MaxLength(30)
    @Trim()
    @IsString()
    @IsNotEmpty()
    title: string;

    @MaxLength(100)
    @Trim()
    @IsString()
    @IsNotEmpty()
    shortDescription: string;

    @MaxLength(1000)
    @Trim()
    @IsString()
    @IsNotEmpty()
    content: string;
    @IsBlogExist({ message: 'blog not found' })
    @Trim()
    @IsString()
    @IsNotEmpty()
    blogId: string;
}

export class createPostByBlogIdDto {
    @MaxLength(30)
    @Trim()
    @IsString()
    @IsNotEmpty()
    title: string;

    @MaxLength(100)
    @Trim()
    @IsString()
    @IsNotEmpty()
    shortDescription: string;

    @MaxLength(1000)
    @Trim()
    @IsString()
    @IsNotEmpty()
    content: string;
}

export class UpdatePostDto {
    @MaxLength(30)
    @Trim()
    @IsString()
    @IsNotEmpty()
    title: string;
    @MaxLength(100)
    @Trim()
    @IsString()
    @IsNotEmpty()
    shortDescription: string;
    @MaxLength(1000)
    @Trim()
    @IsString()
    @IsNotEmpty()
    content: string;
    //@IsBlogExist({ message: 'blog not found' })
    @Trim()
    @IsString()
    @IsNotEmpty()
    blogId: string;
}

export class UpdatePostForBlogDto {
    @MaxLength(30)
    @Trim()
    @IsString()
    @IsNotEmpty()
    title: string;
    @MaxLength(100)
    @Trim()
    @IsString()
    @IsNotEmpty()
    shortDescription: string;
    @MaxLength(1000)
    @Trim()
    @IsString()
    @IsNotEmpty()
    content: string;
}

export class likesDto {
    @IsEnum(REACTIONS_ENUM)
    likeStatus: REACTIONS_ENUM;
}

export class PostType {
    constructor(
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: Date,
    ) {}

    static toVievModel(post: PostType & { id: string }): PostViewType {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: REACTIONS_ENUM.None,
                newestLikes: [],
            },
        };
    }
}

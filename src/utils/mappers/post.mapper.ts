import { PostViewType } from '../../features/public/posts/api/models/output/post-output.model';
import { postDbType } from '../../features/public/posts/domain/post.entity';

interface PostMapper {
    mapPostDbToPostView(post: postDbType): PostViewType;
}

export class PostMapperImp implements PostMapper {
    mapPostDbToPostView(post: postDbType): PostViewType {
        return new PostViewType(
            post.id,
            post.title,
            post.shortDescription,
            post.content,
            post.blogId,
            post.blogName,
            post.createdAt,
            {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: [],
            },
        );
    }
}

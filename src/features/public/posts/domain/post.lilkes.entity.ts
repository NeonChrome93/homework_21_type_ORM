import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { REACTIONS_ENUM } from '../../comments/api/models/output/comments.output.models';
import { Post } from './post.entity';
import { User } from '../../../admin/users/domain/user.entity';

@Entity()
export class Post_likes {
    @PrimaryColumn('uuid')
    id: string;
    @Column()
    userId: string;
    @Column()
    createdAt: Date;
    @Column({
        type: 'enum',
        enum: REACTIONS_ENUM,
        default: REACTIONS_ENUM.None,
    })
    status: REACTIONS_ENUM;
    @Column()
    postId: string;

    @OneToOne(() => User, user => user.postLikes)
    @JoinColumn({ name: 'userId' })
    public user = User;

    @ManyToOne(() => Post, post => post.likes)
    @JoinColumn({ name: 'postId' })
    post: Post;
}

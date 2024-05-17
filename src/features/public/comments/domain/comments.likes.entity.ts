import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { REACTIONS_ENUM } from '../api/models/output/comments.output.models';
import { User } from '../../../admin/users/domain/user.entity';
import { Comment } from './comment.entity';

@Entity()
export class Comments_likes {
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
    commentId: string;

    @OneToOne(() => User, user => user.postLikes)
    @JoinColumn({ name: 'userId' })
    public user = User;

    @ManyToOne(() => Comment, comment => comment.likes)
    @JoinColumn({ name: 'commentId' })
    comment: Comment;
}

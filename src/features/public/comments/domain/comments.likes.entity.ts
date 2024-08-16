import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { REACTIONS_ENUM } from '../api/models/output/comments.output.models';
import { User } from '../../../admin/users/domain/user.entity';
import { Comments } from './comment.entity';

@Entity()
export class Comments_likes {
    @PrimaryGeneratedColumn('uuid')
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

    @ManyToOne(() => User, user => user.postLikes)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Comments, comment => comment.likes)
    @JoinColumn({ name: 'commentId' })
    comment: Comments;
}

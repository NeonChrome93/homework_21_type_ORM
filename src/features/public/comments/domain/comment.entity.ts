import { REACTIONS_ENUM } from '../api/models/output/comments.output.models';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comments_likes } from './comments.likes.entity';
import { Post } from '../../posts/domain/post.entity';

export type CommentsDBType = {
    postId: string;
    content: string;
    userId: string;
    createdAt: Date;
};

@Entity()
export class Comments {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    postId: string;
    @Column()
    content: string;
    @Column()
    userId: string;
    @Column()
    createdAt: Date;

    @OneToMany(() => Comments_likes, likes => likes.comment)
    likes: Comments_likes[];

    @ManyToOne(() => Post, post => post.comment)
    @JoinColumn({ name: 'postId' })
    post: Post;
}

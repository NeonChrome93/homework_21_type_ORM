import { REACTIONS_ENUM } from '../../comments/api/models/output/comments.output.models';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Blog } from '../../../admin/blogs/domain/blog.entity';
import { Post_likes } from './post.lilkes.entity';
import { Comments } from '../../comments/domain/comment.entity';

export type postDbType = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
    reactions: StatusType[];
};

@Entity()
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    title: string;
    @Column()
    shortDescription: string;
    @Index('content1')
    @Column()
    content: string;
    @Column()
    blogId: string;
    @Column()
    blogName: string;
    @Column()
    createdAt: Date;
    reactions: StatusType[];

    @ManyToOne(() => Blog, blog => blog.posts)
    @JoinColumn({ name: 'blogId' })
    blog: Blog;

    @OneToMany(() => Post_likes, likes => likes.post)
    likes: Post_likes[];

    @OneToMany(() => Comments, comment => comment)
    comment: Comments[];
}

export class StatusType {
    userId: string;
    login: string;
    createdAt: Date;
    status: REACTIONS_ENUM;
}

import { REACTIONS_ENUM } from '../../comments/api/models/output/comments.output.models';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Blog } from '../../../admin/blogs/domain/blog.entity';

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
}

export class StatusType {
    userId: string;
    login: string;
    createdAt: Date;
    status: REACTIONS_ENUM;
}

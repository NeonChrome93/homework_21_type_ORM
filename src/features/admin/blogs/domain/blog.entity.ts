import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../../public/posts/domain/post.entity';

export type BlogDbType = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
};

@Entity()
export class Blog extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ collation: 'C' })
    name: string;
    @Column()
    description: string;
    @Column()
    websiteUrl: string;
    @Column()
    createdAt: Date;
    @Column()
    isMembership: boolean;

    static async createInMemo(name: string, description: string, websiteUrl: string, isMembership: boolean = false) {
        const blog: Blog = new Blog();
        blog.name = name;
        blog.description = description;
        blog.websiteUrl = websiteUrl;
        blog.createdAt = new Date();
        blog.isMembership = isMembership;

        await this.save(blog);

        return blog;
    }

    @OneToMany(() => Post, post => post.blog)
    posts: Post[];
}

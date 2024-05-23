import { UpdateBlogTypeDto } from '../api/models/input/blog.input.model';
import { BlogsViewType } from '../api/models/output/blog.output.model';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Blog, BlogDbType } from '../domain/blog.entity';
import { Post } from '../../../public/posts/domain/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlogRepository {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(Blog) public blogRepository: Repository<Blog>,
    ) {}

    async readBlogsId(id: string): Promise<BlogDbType | null> {
        const blog = await this.blogRepository.findOne({ where: { id: id } });
        return blog;
    }

    async createBlog(newBlog: Blog): Promise<BlogsViewType> {
        // const query = `INSERT INTO public.blogs(
        //                 name, description, "websiteUrl", "createdAt", "isMembership")
        //                VALUES ($1, $2, $3, $4, $5)
        //                returning id;`;
        //
        // const blog = await this.dataSource.query(query, [
        //     newBlog.name,
        //     newBlog.description,
        //     newBlog.websiteUrl,
        //     newBlog.createdAt,
        //     newBlog.isMembership,
        // ]);
        const blog = await Blog.createInMemo(newBlog.name, newBlog.description, newBlog.websiteUrl);
        const blogsView: BlogsViewType = { ...blog, id: blog.id } as BlogsViewType;
        return blogsView;
    }

    async updateBlogs(id: string, newUpdateRequest: UpdateBlogTypeDto): Promise<boolean> {
        // const query = `UPDATE public.blog
        //                 SET name= $2, description=$3, "websiteUrl"=$4
        //                 WHERE id = $1`;
        const blog = await this.dataSource.getRepository(Blog).update(
            { id: id },
            {
                name: newUpdateRequest.name,
                description: newUpdateRequest.description,
                websiteUrl: newUpdateRequest.websiteUrl,
            },
        );
        if (!blog) return false;
        return true;
    }

    async deleteBlogs(id: string): Promise<boolean> {
        // const query = `DELETE FROM public.posts
        //                 WHERE "blogId" = $1`;
        // const query2 = `DELETE FROM public.blogs
        //                 WHERE id = $1`;

        // const deleted = await this.dataSource
        //     .getRepository(Post)
        //     .createQueryBuilder()
        //     .delete()
        //     .from(Post)
        //     .where('blogId = :id', { id: id })
        //     .execute();
        const deleted2 = await this.dataSource
            .getRepository(Blog)
            .createQueryBuilder()
            .delete()
            .from(Blog)
            .where('id = :id', { id: id })
            .execute();

        if (!deleted2) return false;
        return true;
    }
}

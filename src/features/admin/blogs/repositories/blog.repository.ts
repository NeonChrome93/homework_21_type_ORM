import { UpdateBlogTypeDto } from '../api/models/input/blog.input.model';
import { BlogsViewType } from '../api/models/output/blog.output.model';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Blog, BlogDbType } from '../domain/blog.entity';

@Injectable()
export class BlogRepository {
    constructor(private dataSource: DataSource) {}

    async readBlogsId(id: string): Promise<BlogDbType | null> {
        const query = `SELECT * FROM public.blogs
                        WHERE id = $1`;
        const blog: BlogDbType | null = await this.dataSource.query(query, [id]);
        return blog[0];
    }

    async createBlog(newBlog: Blog): Promise<BlogsViewType> {
        const query = `INSERT INTO public.blogs(
                        name, description, "websiteUrl", "createdAt", "isMembership")
                       VALUES ($1, $2, $3, $4, $5)
                       returning id;`;

        const blog = await this.dataSource.query(query, [
            newBlog.name,
            newBlog.description,
            newBlog.websiteUrl,
            newBlog.createdAt,
            newBlog.isMembership,
        ]);
        const blogsView: BlogsViewType = { ...newBlog, id: blog[0].id };
        return blogsView;
    }

    async updateBlogs(id: string, newUpdateRequest: UpdateBlogTypeDto): Promise<boolean> {
        const query = `UPDATE public.blogs
                        SET name= $2, description=$3, "websiteUrl"=$4
                        WHERE id = $1`;
        const blog = await this.dataSource.query(query, [
            id,
            newUpdateRequest.name,
            newUpdateRequest.description,
            newUpdateRequest.websiteUrl,
        ]);
        if (!blog) return false;
        return true;
    }

    async deleteBlogs(id: string): Promise<boolean> {
        const query = `DELETE FROM public.posts
                        WHERE "blogId" = $1`;
        const query2 = `DELETE FROM public.blogs
                        WHERE id = $1`;

        const deleted = await this.dataSource.query(query, [id]);
        const deleted2 = await this.dataSource.query(query2, [id]);

        if (!deleted || !deleted2) return false;
        return true;
    }
}

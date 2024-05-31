import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { PostViewType } from '../features/public/posts/api/models/output/post-output.model';
import { agent as request } from 'supertest';

let postId = '';
const commentId = '';
let post: PostViewType;

const createBlog = {
    name: 'Yaroslaw',
    description: 'blabla',
    websiteUrl: 'https://odintsovo.hh.ru/vacancy/81832912?from=vacancy_search_list',
};

const createPost = {
    title: 'Cook',
    shortDescription: 'Kitchen',
    content: 'Reciepe',
    blogId: '',
};

const updatePost = {
    title: 'Sport',
    shortDescription: 'Gum',
    content: 'Every day',
};

const headers = {
    Authorization: 'Basic YWRtaW46cXdlcnR5',
};

describe('Post API', () => {
    let app: INestApplication;

    beforeEach(async () => {
        console.log('ENV in TESTS', process.env.ENV);
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('Before all', async () => {
        await request(app.getHttpServer()).delete('/testing/all-data').expect(204);
    });

    it('Get all posts', async () => {
        await request(app.getHttpServer())
            .get('/posts')
            .expect(200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 0, items: [] });
    });

    it('Create Blog', async () => {
        const res = await request(app.getHttpServer()).post('/sa/blogs').set(headers).send(createBlog).expect(201);
        //console.log(res.body)
        createPost.blogId = res.body.id;
    });

    it('Create Post', async () => {
        const res = await request(app.getHttpServer()).post('/posts').set(headers).send(createPost).expect(201);
        postId = res.body.id;
        post = res.body;
    });

    it('Should create post with blogId', async () => {
        const blog = await request(app.getHttpServer()).post('/sa/blogs').set(headers).send(createBlog).expect(201);
        const post = await request(app.getHttpServer())
            .post(`/sa/blogs/${blog.body.id}/posts`)
            .set(headers)
            .send({ ...createPost });
        await request(app.getHttpServer()).get(`/posts/${post.body.id}`).expect(200);
    });

    it('Update post by blog id', async () => {
        const blog = await request(app.getHttpServer()).post('/sa/blogs').set(headers).send(createBlog).expect(201);
        const post = await request(app.getHttpServer())
            .post('/posts')
            .set(headers)
            .send({ ...createPost })
            .expect(201);
        await request(app.getHttpServer())
            .put(`/sa/blogs/${blog.body.id}/posts/${post.body.id}`)
            .set(headers)
            .send(updatePost)
            .expect(204);
    });

    it('Delete post by blog id', async () => {
        const blog = await request(app.getHttpServer()).post('/sa/blogs').set(headers).send(createBlog).expect(201);
        const post = await request(app.getHttpServer())
            .post(`/blogs/${blog.body.id}/posts`)
            .set(headers)
            .send({ ...createPost });
        await request(app.getHttpServer())
            .delete(`/sa/blogs/${blog.body.id}/posts/${post.body.id}`)
            .set(headers)
            .expect(204);
        await request(app.getHttpServer()).get(`/posts/${post.body.id}`).expect(404);
    });
});

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { agent as request } from 'supertest';

const headers = {
    Authorization: 'Basic YWRtaW46cXdlcnR5',
};

const createQuestion = {
    body: 'ivan',
    correctAnswers: ['str', 'fdsdsfdsf'],
};

const updateQuestion = {
    body: 'ivar',
    correctAnswers: ['str', 'nostr'],
};

describe('Question API', () => {
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

    it('Get All Questions ', async () => {
        await request(app.getHttpServer())
            .get('/sa/quiz/questions')
            .set(headers)
            .expect(200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] });
    });

    it('Create Question', async () => {
        await request(app.getHttpServer()).post('/sa/quiz/questions').set(headers).send(createQuestion).expect(201);
    });

    it('Update Question By Id', async () => {
        const question = await request(app.getHttpServer())
            .post('/sa/quiz/questions')
            .set(headers)
            .send(createQuestion)
            .expect(201);
        await request(app.getHttpServer())
            .put(`/sa/quiz/questions/${question.body.id}`)
            .set(headers)
            .send(updateQuestion)
            .expect(204);
    });

    it('Publish Question', async () => {
        const question = await request(app.getHttpServer())
            .post('/sa/quiz/questions')
            .set(headers)
            .send(createQuestion)
            .expect(201);
        await request(app.getHttpServer())
            .put(`/sa/quiz/questions/${question.body.id}/publish`)
            .set(headers)
            .send({ published: true })
            .expect(204);
    });

    it('Delete Question', async () => {
        const question = await request(app.getHttpServer())
            .post('/sa/quiz/questions')
            .set(headers)
            .send(createQuestion)
            .expect(201);
        await request(app.getHttpServer()).delete(`/sa/quiz/questions/${question.body.id}`).set(headers).expect(204);
    });
});

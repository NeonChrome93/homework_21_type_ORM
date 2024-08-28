import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { agent as request } from 'supertest';

const createUser1 = {
    login: 'Ivar',
    email: 'y.snegirov@yandex.ru',
    password: '12345678',
};

const createUser2 = {
    login: 'Ivan',
    email: 'ivan@yandex.ru',
    password: '12345678',
};

const createQuestion1 = {
    body: 'ivar11111111',
    correctAnswers: ['correct_answer_1'],
};

const createQuestion2 = {
    body: 'ivar11111112',
    correctAnswers: ['correct_answer_1'],
};

const createQuestion3 = {
    body: 'ivar11111111',
    correctAnswers: ['correct_answer_1'],
};

const headers = {
    Authorization: 'Basic YWRtaW46cXdlcnR5',
    'user-agent': 'Mozilla',
};

describe(
    'POST -> "/pair-game-quiz/pairs/my-current/answers", ' +
        'GET -> "/pair-game-quiz/pairs", ' +
        'GET -> "/pair-game-quiz/pairs/my-current": add answers to first game, created by user1, connected by user2: ' +
        'add correct answer by firstPlayer; add incorrect answer by secondPlayer; add correct answer by secondPlayer; ' +
        'get active game and call "/pair-game-quiz/pairs/my-current by both users after each answer"; status 200;',
    () => {
        let app: INestApplication;
        let tokenOne: string;
        let tokenTwo: string;
        let gameId: string;

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

        it('Create User', async () => {
            await request(app.getHttpServer()).post('/sa/users').set(headers).send(createUser1).expect(201);
            await request(app.getHttpServer()).post('/sa/users').set(headers).send(createUser2).expect(201);
        });

        it('Login', async () => {
            const resOne = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    loginOrEmail: createUser1.login,
                    password: createUser1.password,
                })
                .expect(200);
            tokenOne = resOne.body.accessToken;
            const resTwo = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    loginOrEmail: createUser1.login,
                    password: createUser1.password,
                })
                .expect(200);
            tokenTwo = resTwo.body.accessToken;
        });

        it('Create Answers', async () => {
            await request(app.getHttpServer())
                .post('/sa/quiz/questions')
                .set(headers)
                .send(createQuestion1)
                .expect(201);
            await request(app.getHttpServer())
                .post('/sa/quiz/questions')
                .set(headers)
                .send(createQuestion2)
                .expect(201);
            await request(app.getHttpServer())
                .post('/sa/quiz/questions')
                .set(headers)
                .send(createQuestion3)
                .expect(201);
        });

        it('Create a game and add answers', async () => {
            // Create a game
            const createGameResponse = await request(app.getHttpServer())
                .post('/pair-game-quiz/pairs/connection')
                .set({ authorization: 'Bearer ' + tokenOne })
                .expect(200);
            gameId = createGameResponse.body.id;

            // Connect second player
            await request(app.getHttpServer())
                .post(`/pair-game-quiz/pairs/connection`)
                .set({ authorization: 'Bearer ' + tokenTwo })
                .expect(200);

            // Add correct answer by first player
            await request(app.getHttpServer())
                .post(`/pair-game-quiz/pairs/my-current/answers`)
                .set({ authorization: 'Bearer ' + tokenOne })
                .send({ answer: 'correct_answer_1' })
                .expect(200);

            // Add incorrect answer by second player
            await request(app.getHttpServer())
                .post(`/pair-game-quiz/pairs/my-current/answers`)
                .set({ authorization: 'Bearer ' + tokenTwo })
                .send({ answer: 'incorrect_answer' })
                .expect(200);

            // Add correct answer by second player
            await request(app.getHttpServer())
                .post(`/pair-game-quiz/pairs/my-current/answers`)
                .set({ authorization: 'Bearer ' + tokenTwo })
                .send({ answer: 'correct_answer_2' })
                .expect(200);
        });
    },
);

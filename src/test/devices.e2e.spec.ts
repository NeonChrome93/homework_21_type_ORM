import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { appSettings } from '../config/app.settings';
import { AppModule } from '../app.module';
import { Device } from '../features/public/devices/domain/device.entity';
import { JwtAdapter } from '../features/public/auth/adapters/jwt.adapter';
import { agent as request } from 'supertest';
import { createNewUserModel, createUser, unpackingToken } from './utils';
import { DevicesQueryRepository } from '../features/public/devices/repositories/device.query.repository';

let deviceGlobal: Device | null = null;
let token = '';

describe('Create device, delete device by id, delete all devices except the current one', () => {
    let app: INestApplication;
    let devicesRepository;
    let jwtAdapter;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        appSettings(app);

        devicesRepository = moduleFixture.get<DevicesQueryRepository>(DevicesQueryRepository);
        jwtAdapter = moduleFixture.get<JwtAdapter>(JwtAdapter);
        await app.init();
    });

    it('deleteAll', async () => {
        await request(app.getHttpServer()).delete('/testing/all-data').expect(204);
    });

    it('Login in app, make sure that device created', async () => {
        const model = createNewUserModel();
        const user = await createUser(app, model);

        expect(user).toEqual({
            id: expect.any(String),
            login: model.login,
            email: model.email,
            createdAt: expect.any(String),
        });

        //process.env.REFRESH_TIME = '1m'
        const login = await request(app.getHttpServer()).post('/auth/login').set('User-Agent', 'Chrome').send({
            loginOrEmail: model.login,
            password: model.password,
        });

        // expect(login.body).toEqual({
        //     refreshToken: expect.any(String)
        // })

        const refreshToken = login.headers['set-cookie'];
        token = refreshToken;

        const refreshTokenArr = unpackingToken(login);
        const payload = await jwtAdapter.getPayloadByToken(refreshTokenArr);

        console.log('deviceId', payload.deviceId);

        const device = await devicesRepository.findDevice(payload.deviceId);
        deviceGlobal = device;

        expect(device.title).toBe('Chrome');
    });

    it('Get devices', async () => {
        const res1 = await request(app.getHttpServer()).post('/auth/refresh-token').set('Cookie', token).expect(200);
        //console.log('accessToken', accessToken.body.accessToken)//новые куки

        const response = await request(app.getHttpServer()).get('/security/devices').set('Cookie', token).expect(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({ title: 'Chrome' })]));
    });

    it('Delete Device by id', async () => {
        await request(app.getHttpServer())
            .delete(`/security/devices/${deviceGlobal?.deviceId}`)
            .set('Cookie', token)
            .expect(204);
    });

    it('Delete Device 403 incorrect', async () => {
        const model = createNewUserModel();
        const user = await createUser(app, model);

        expect(user).toEqual({
            id: expect.any(String),
            login: model.login,
            email: model.email,
            createdAt: expect.any(String),
        });

        const model2 = createNewUserModel();
        const user2 = await createUser(app, model2);

        expect(user2).toEqual({
            id: expect.any(String),
            login: model2.login,
            email: model2.email,
            createdAt: expect.any(String),
        });

        const loginUser1 = await request(app.getHttpServer()).post('/auth/login').set('User-Agent', 'Edge').send({
            loginOrEmail: model.login,
            password: model.password,
        });
        console.log('loginUser', loginUser1);
        const loginUser2 = await request(app.getHttpServer()).post('/auth/login').set('User-Agent', 'Mozilla').send({
            loginOrEmail: model2.login,
            password: model2.password,
        });
        console.log('loginUser2', loginUser2);

        //const refreshUser1 = loginUser1.headers['set-cookie']
        const refreshUser2 = loginUser2.headers['set-cookie'];

        const refreshTokenUser1 = unpackingToken(loginUser1);
        const payloadTokenUser1 = await jwtAdapter.getPayloadByToken(refreshTokenUser1);

        await request(app.getHttpServer())
            .delete(`/security/devices/${payloadTokenUser1?.deviceId}`)
            .set('Cookie', refreshUser2)
            .expect(403);
    });

    it('Delete all devices except current  ', async () => {
        const model = createNewUserModel();
        const user = await createUser(app, model);

        expect(user).toEqual({
            id: expect.any(String),
            login: model.login,
            email: model.email,
            createdAt: expect.any(String),
        });

        process.env.REFRESH_TIME = '1m';
        const loginDevice1 = await request(app.getHttpServer()).post('/auth/login').set('User-Agent', 'Edge').send({
            loginOrEmail: model.login,
            password: model.password,
        });

        const loginDevice2 = await request(app.getHttpServer()).post('/auth/login').set('User-Agent', 'Mozilla').send({
            loginOrEmail: model.login,
            password: model.password,
        });

        const refreshToken1 = loginDevice1.headers['set-cookie'];
        // const refreshToken2 = loginDevice2.headers['set-cookie'];

        await request(app.getHttpServer()).delete('/security/devices').set('Cookie', refreshToken1).expect(204);
        const response = await request(app.getHttpServer())
            .get('/security/devices')
            .set('Cookie', refreshToken1)
            .expect(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.not.objectContaining({ title: 'Mozilla' })]));
    });
});

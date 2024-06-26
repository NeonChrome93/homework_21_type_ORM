import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { EmailAdapter } from '../../features/public/auth/adapters/email.adapter';
import { appSettings } from '../../config/app.settings';
import { agent as request } from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UserViewModel } from '../../features/admin/users/api/models/output/user.output.model';

const SendEmailMock = jest.fn();

const EmailAdapterMock = {
    sendEmail: SendEmailMock,
};

export const getTestingApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    })
        .overrideProvider(EmailAdapter)
        .useValue(EmailAdapterMock)
        .compile();
    const app = moduleFixture.createNestApplication();
    appSettings(app);

    await app.init();
    return { app, moduleFixture };
};

const authBasicHeaders = {
    Authorization: 'Basic YWRtaW46cXdlcnR5',
    'user-agent': 'Mozilla',
};

export type UserCreationTestModel = {
    email: string;
    login: string;
    password: string;
};

export async function createUser(app: INestApplication, model: UserCreationTestModel): Promise<UserViewModel> {
    const result = await request(app.getHttpServer())
        .post('/sa/users')
        .set(authBasicHeaders)
        .send({
            ...model,
        });

    return result.body;
}

// async createUser(model: UserCreateModel): Promise<UserViewModel> {
//     const result = await this.config
//         .getHttp()
//         .post('/sa/users')
//         .set('Authorization', 'Basic ' + authBasic64)
//         .set('Content-Type', 'application/json')
//         .send({
//             ...model,
//         } as UserCreateModel);
//     return result.body;
// }

export function createNewUserModel(): UserCreationTestModel {
    const { login, password } = generateCredentials();
    return {
        email: `${login}@gmail.com`,
        login,
        password,
    };
}

function generateCredentials(loginLength = 8, passwordLength = 8): { login: string; password: string } {
    return { login: generateString(loginLength), password: generateString(passwordLength) };
}

function generateString(length = 20): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let string: string = '';
    for (let i = 0; i < length; i++) {
        string += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return string;
}

export const wait = (sec: number): Promise<boolean> => {
    return new Promise(res => {
        setTimeout(() => res(true), sec * 1000);
    });
};

export const unpackingToken = res =>
    res.headers['set-cookie'][0]
        .split(',')
        .map(item => item.split(';')[0])
        .join('; ')
        .split('=')[1];

import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { appSettings } from '../../config/app.settings';

let connection: Connection;
let app: INestApplication;

export const createTestApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'your_username',
                password: 'your_password',
                database: 'your_database_name',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
            AppModule,
        ],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSettings(app);
    await app.init();

    connection = moduleFixture.get<Connection>(Connection);

    return app;
};

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { DelController } from './testing-all-data/testing.controller';
import { AuthModule } from './features/admin/users/auth.module';
import { PostModule } from './features/public/posts/post.module';
import { BlogModule } from './features/admin/blogs/blog.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config, ConfigurationType } from './config/configuration';
import * as dotenv from 'dotenv';
// import config from './config/configuration';

dotenv.config();
// const configeFile = config();

export const options: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(<string>process.env.POSTGRES_PORT),
    username: 'postgres',
    password: 'necron23',
    database: 'blogs-posts-ORM',
    entities: [],
    autoLoadEntities: true,
    logging: ['query'],
    synchronize: true,
};

console.log(process.env.POSTGRES_USER);

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config],
        }),
        // ThrottlerModule.forRoot([
        //     {
        //         ttl: 10000,
        //         limit: 5,
        //     },
        // ]),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService<ConfigurationType>) => {
                const environmentSettings = config.get('environmentSettings', { infer: true });
                console.log('ENV', environmentSettings);

                const database = environmentSettings.isTesting
                    ? config.get('databaseSettings.POSTGRES_CONNECTION_URI_FOR_TESTS', { infer: true })
                    : config.get('databaseSettings.POSTGRES_CONNECTION_URI', { infer: true });
                console.log('123132', database);

                return {
                    url: database,
                    type: 'postgres',
                    entities: [],
                    autoLoadEntities: true,
                    //...(true ? { logging: ['query'] } : {}),
                    synchronize: false,
                };
            },
            inject: [ConfigService],
        }),

        // TypeOrmModule.forRoot(options),
        ConfigModule.forRoot({ isGlobal: true }),

        CqrsModule,

        PassportModule,
        AuthModule,
        PostModule,
        BlogModule,
        CqrsModule,

        // смотреть видео о переменных окружения
        //разнести на модули пока будет время
    ],
    controllers: [AppController, DelController],
    providers: [AppService],
})
export class AppModule {}

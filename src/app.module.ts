import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { DelController } from './testing-all-data/testing.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './features/admin/users/auth.module';
import { PostModule } from './features/public/posts/post.module';
import { BlogModule } from './features/admin/blogs/blog.module';

export const options: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'necron23',
    database: 'blogs-posts-ORM',
    entities: [],
    autoLoadEntities: true,
    logging: ['query'],
    synchronize: false,
};

@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 10000,
                limit: 5,
            },
        ]),
        TypeOrmModule.forRoot(options),
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

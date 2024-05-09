import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export default new DataSource({
    url: process.env.DATABASE_URL || 'postgres://postgres:necron23@localhost:5432/blogs-posts-ORM',
    type: 'postgres',
    migrations: ['migrations/*.ts'],
    entities: ['src/**/*.entity.ts'],
});

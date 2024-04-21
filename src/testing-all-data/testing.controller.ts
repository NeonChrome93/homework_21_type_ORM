import { Controller, Delete, HttpCode } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('testing')
export class DelController {
    constructor(private dataSource: DataSource) {}
    @Delete('all-data')
    @HttpCode(204)
    async DeleteAllData() {
        await this.dataSource.query(`DELETE FROM public.comments_likes CASCADE`);
        await this.dataSource.query(`DELETE FROM public.post_likes CASCADE`);
        await this.dataSource.query(`DELETE FROM public.devices CASCADE`);
        await this.dataSource.query(`DELETE FROM public.comments CASCADE`);
        await this.dataSource.query(`DELETE FROM public.users CASCADE`);
        await this.dataSource.query(`DELETE FROM public.posts CASCADE`);
        await this.dataSource.query(`DELETE FROM public.blogs CASCADE`);
    }
}

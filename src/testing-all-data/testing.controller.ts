import { Controller, Delete, HttpCode } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('testing')
export class DelController {
    constructor(private dataSource: DataSource) {}
    @Delete('all-data')
    @HttpCode(204)
    async DeleteAllData() {
        await this.dataSource.query(`DELETE FROM public.game_question_entity CASCADE`);
        await this.dataSource.query(`DELETE FROM public.comments_likes CASCADE`);
        await this.dataSource.query(`DELETE FROM public.post_likes CASCADE`);
        await this.dataSource.query(`DELETE FROM public.device CASCADE`);
        await this.dataSource.query(`DELETE FROM public.comments CASCADE`);
        await this.dataSource.query(`DELETE FROM public.user CASCADE`);
        await this.dataSource.query(`DELETE FROM public.post CASCADE`);
        await this.dataSource.query(`DELETE FROM public.blog CASCADE`);
    }
}

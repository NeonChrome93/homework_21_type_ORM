import { Injectable } from '@nestjs/common';

import { FindManyOptions, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GameQuestionEntity } from '../domain/question.entity';
import { QuestionViewType } from '../api/models/output/output-question';
import { PaginationModels, QueryPaginationType } from '../../../../utils/pagination';

@Injectable()
export class QuestionQueryRepository {
    constructor(@InjectRepository(GameQuestionEntity) public questionQueryRepository: Repository<GameQuestionEntity>) {}

    async findAllQuestions(pagination: QueryPaginationType): Promise<PaginationModels<QuestionViewType[]>> {
        const findAllQuestions = await this.questionQueryRepository.find({
            where: {
                body: ILike(`%${pagination.searchNameTerm}%`),
            },
            order: { [pagination.sortBy]: pagination.sortDirection },
            take: pagination.pageSize,
            skip: (pagination.pageNumber - 1) * pagination.pageSize,
        } as FindManyOptions<GameQuestionEntity>);

        const resultCount = await this.questionQueryRepository
            .createQueryBuilder('q')
            .select('COUNT(q.id)', 'count')
            .where('q.body ILIKE :searchNameTerm', { searchNameTerm: `%${pagination.searchNameTerm}%` })
            .getRawOne();

        const totalCount = resultCount.count;

        const pagesCount: number = Math.ceil(+totalCount / pagination.pageSize);

        return {
            pagesCount: pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: +totalCount,
            items: findAllQuestions.map(
                (q: GameQuestionEntity): QuestionViewType => ({
                    id: q.id,
                    body: q.body,
                    correctAnswers: q.correctAnswers,
                    published: q.published,
                    createdAt: q.createdAt.toISOString(),
                    updatedAt: q.updatedAt.toISOString(),
                }),
            ),
        };
    }
}

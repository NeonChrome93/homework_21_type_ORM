import { PaginationModels, QueryUserPaginationType } from '../../../../utils/pagination';
import { Injectable } from '@nestjs/common';
import { UserViewModel } from '../api/models/output/user.output.model';
import { DataSource } from 'typeorm';
import { User } from '../domain/user.entity';

@Injectable()
export class UsersQueryRepository {
    constructor(private dataSource: DataSource) {}

    async getUsers(pagination: QueryUserPaginationType): Promise<PaginationModels<UserViewModel[]>> {
        const queryFilter = `
        SELECT *
        FROM public.user
        WHERE "login" ILIKE $1 OR "email" ILIKE $2
        ORDER BY "${pagination.sortBy}" ${pagination.sortDirection}
        LIMIT ${pagination.pageSize} OFFSET ${(pagination.pageNumber - 1) * pagination.pageSize}
    `;

        const findAllUsers = await this.dataSource.query(queryFilter, [
            `%${pagination.searchLoginTerm}%`,
            `%${pagination.searchEmailTerm}%`,
        ]);

        const countTotalCount = `
        SELECT count(id)
        FROM "user"
        WHERE "login" ILIKE $1 OR "email" ILIKE $2
    `;

        const resultCount = await this.dataSource.query(countTotalCount, [
            `%${pagination.searchLoginTerm}%`,
            `%${pagination.searchEmailTerm}%`,
        ]);

        const totalCount = +resultCount[0].count;
        const pagesCount: number = Math.ceil(totalCount / pagination.pageSize);

        return {
            pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items: findAllUsers.map((user: User) => ({
                id: user.id,
                login: user.login,
                email: user.email,
                createdAt: user.createdAt,
            })),
        };
    }
}

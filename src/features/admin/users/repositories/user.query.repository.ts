import { PaginationModels } from '../../../../utils/pagination';
import { Injectable } from '@nestjs/common';
import { UserViewModel } from '../api/models/output/user.output.model';
import { DataSource } from 'typeorm';
import { User } from '../domain/db-model';

@Injectable()
export class UsersQueryRepository {
    constructor(private dataSource: DataSource) {}

    async getUsers(
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number,
        searchLoginTerm: string,
        searchEmailTerm: string,
    ): Promise<PaginationModels<UserViewModel[]>> {
        const queryFilter = `
				select *
					from public."users"
					WHERE "login" ILIKE '%${searchLoginTerm}%' OR "email" ILIKE '%${searchEmailTerm}%'
						order by "${sortBy}" ${sortDirection}
					  limit ${pageSize} offset ${(pageNumber - 1) * pageSize}
	`;

        const findAllUsers = await this.dataSource.query(queryFilter);

        const countTotalCount = `
		    SELECT count(id)
			  from "users"
				WHERE "login" ILIKE $1 OR "email" ILIKE $2
	`;

        const resultCount = await this.dataSource.query(countTotalCount, [
            `%${searchLoginTerm}%`,
            `%${searchEmailTerm}%`,
        ]);
        const totalCount = resultCount[0].count;

        const pagesCount: number = await Math.ceil(totalCount / pageSize);
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: +totalCount,
            items: findAllUsers.map(
                (user: User): UserViewModel => ({
                    id: user.id.toString(),
                    login: user.login,
                    email: user.email,
                    createdAt: user.createdAt.toISOString(),
                }),
            ),
        };
    }
}

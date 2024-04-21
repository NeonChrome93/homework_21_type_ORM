import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User, UserDbModel } from '../domain/db-model';

@Injectable()
export class UserRepository {
    constructor(private dataSource: DataSource) {}

    async createUser(newUser: UserDbModel) {
        //console.log(newUser.createdAt);
        const userId = await this.dataSource.query(
            `
			INSERT INTO public.user("login", "email", "passwordHash", "createdAt",  "confirmationCode", "expirationDateOfRecoveryCode", "isConfirmed")
				VALUES ($1, $2, 
				$3, $4, $5, $6, $7)
				returning id
	`,
            [
                newUser.login,
                newUser.email,
                newUser.passwordHash,
                newUser.createdAt,
                newUser.confirmationCode,
                newUser.expirationDateOfRecoveryCode,
                newUser.isConfirmed,
            ],
        );

        return userId[0].id;
    }

    async deleteUser(userId: string) {
        const query = `DELETE FROM public."users"
			  WHERE "id" = $1`;
        const deleted = await this.dataSource.query(query, [userId]);
        if (!deleted) return false;
        return true;
    }

    async readUserById(id: string): Promise<User | null> {
        const result: User | null = await this.dataSource.query(
            `
        SELECT  *
        FROM public.users
        WHERE "id" = $1;
`,
            [id],
        );
        return result[0];
    }

    async saveUser(newUser: User) {
        const query = `UPDATE public.users
                    SET  login=$1, email=$2, "passwordSalt"=$3, "passwordHash"=$4, "createdAt"=$5,"confirmationCode"=$6,
                    "isConfirmed"=$7, "passwordRecoveryCode"=$8, "expirationDateOfRecoveryCode"=$9
                     WHERE "id" = $10`;
        const user = await this.dataSource.query(query, [
            newUser.login,
            newUser.email,
            newUser.passwordSalt,
            newUser.passwordHash,
            newUser.createdAt,
            newUser.confirmationCode,
            newUser.isConfirmed,
            newUser.passwordRecoveryCode,
            newUser.expirationDateOfRecoveryCode,
            newUser.id,
        ]);

        return user;
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
        const query = `
        SELECT *
        FROM public.user
        WHERE "login" = $1 OR "email" = $1
    `;

        const result: User | null = await this.dataSource.query(query, [loginOrEmail]);
        return result[0];
    }

    async findUserByRecoveryCode(recoveryCode: string): Promise<User | null> {
        const result = await this.dataSource.query(
            `
        SELECT  "passwordRecoveryCode"
        FROM public.users
        WHERE "passwordRecoveryCode" = $1;
`,
            [recoveryCode],
        );
        return result[0];
    }

    async readUserByCode(code: string): Promise<User | null> {
        // const user: User | null = await this.UserModel.findOne({confirmationCode: code});
        const user = await this.dataSource.query(
            `
        SELECT  *
        FROM public.users
        WHERE "confirmationCode" = $1;
`,
            [code],
        );

        if (!user) {
            return null;
        }
        return user[0];
    }

    async readUserByEmail(email: string): Promise<User | null> {
        const user = await this.dataSource.query(
            `
        SELECT *
        FROM public.users
        WHERE email = $1;
`,
            [email],
        );

        if (!user) {
            return null;
        }
        return user[0];
    }

    async updateConfirmationCode(id: string, newCode: string): Promise<boolean> {
        const query = `UPDATE public.users
                       SET  "confirmationCode"= $1
                       WHERE id = $2`;
        const result = await this.dataSource.query(query, [newCode, id]);
        if (!result) return false;
        return true;
    }

    async confirmEmail(id: string): Promise<boolean> {
        const query = `UPDATE public.users
                       SET  "isConfirmed"= true
                       WHERE id = $1`;
        const result = await this.dataSource.query(query, [id]);

        if (!result) return false;
        return true;
    }
}

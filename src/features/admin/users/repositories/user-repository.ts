import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User, UserDbModel } from '../domain/user.entity';

@Injectable()
export class UserRepository {
    constructor(private dataSource: DataSource) {}

    async createUser(newUser: UserDbModel) {
        //console.log(newUser.createdAt);
        const user = await this.dataSource.getRepository(User).create({
            login: newUser.login,
            email: newUser.email,
            passwordHash: newUser.passwordHash,
            createdAt: newUser.createdAt,
            confirmationCode: newUser.confirmationCode,
            expirationDateOfRecoveryCode: newUser.expirationDateOfRecoveryCode,
            isConfirmed: newUser.isConfirmed,
        });
        const savedUser = await this.dataSource.getRepository(User).save(user);

        console.log(savedUser);
        return savedUser.id;
    }

    async deleteUser(userId: string) {
        // const query = `DELETE FROM public."users"
        // WHERE "id" = $1`;
        const deleted = await this.dataSource
            .createQueryBuilder()
            .delete()
            .from(User)
            .where('id = :id', { id: userId })
            .execute();
        if (!deleted) return false;
        return true;
    }

    async readUserById(id: string): Promise<User | null> {
        const result: User | null = await this.dataSource
            .getRepository(User)
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .getOne();
        return result;
    }

    async saveUser(newUser: User) {
        // const query = `UPDATE public.users
        //             SET  login=$1, email=$2, "passwordSalt"=$3, "passwordHash"=$4, "createdAt"=$5,"confirmationCode"=$6,
        //             "isConfirmed"=$7, "passwordRecoveryCode"=$8, "expirationDateOfRecoveryCode"=$9
        //              WHERE "id" = $10`;
        const user = await this.dataSource.getRepository(User).save(newUser);

        return user;
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
        //     const query = `
        //     SELECT *
        //     FROM public.user
        //     WHERE "login" = $1 OR "email" = $1
        // `;

        const result: User | null = await this.dataSource
            .getRepository(User)
            .createQueryBuilder('user')
            .where('user.login = :loginOrEmail OR user.email = :loginOrEmail', { loginOrEmail })
            .getOne();

        return result;
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
        const user = await this.dataSource
            .getRepository(User)
            .createQueryBuilder('user')
            .where('user.confirmationCode = :code', { code })
            .getOne();

        if (!user) {
            return null;
        }
        return user;
    }

    async readUserByEmail(email: string): Promise<User | null> {
        const user = await this.dataSource
            .getRepository(User)
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .getOne();

        if (!user) {
            return null;
        }
        return user;
    }

    async updateConfirmationCode(id: string, newCode: string): Promise<boolean> {
        /* const query = `UPDATE public.users
                       SET  "confirmationCode"= $1
                       WHERE id = $2`;
        const result = await this.dataSource.query(query, [newCode, id]);*/
        const result = await this.dataSource.getRepository(User).update(
            {
                id: id,
            },
            {
                confirmationCode: newCode,
            },
        );
        if (!result) return false;
        return true;
    }

    async confirmEmail(id: string): Promise<boolean> {
        // const query = `UPDATE public.users
        //                SET  "isConfirmed"= true
        //                WHERE id = $1`;
        const result = await this.dataSource.getRepository(User).update(
            {
                id: id,
            },
            {
                isConfirmed: true,
            },
        );

        if (!result) return false;
        return true;
    }
}

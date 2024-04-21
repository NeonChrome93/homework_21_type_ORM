import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type UserDbModel = {
    login: string;
    email: string;
    passwordSalt: string;
    passwordHash: string;
    createdAt: Date;
    confirmationCode: string;
    isConfirmed: boolean;
    passwordRecoveryCode: string | null;
    expirationDateOfRecoveryCode: Date | null;
};

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    login: string;
    @Column()
    email: string;
    @Column({ default: null })
    passwordSalt: string;
    @Column()
    passwordHash: string;
    @Column()
    createdAt: Date;
    @Column()
    confirmationCode: string;
    @Column()
    isConfirmed: boolean;
    @Column({ default: null })
    passwordRecoveryCode: string | null;
    @Column({ default: null })
    expirationDateOfRecoveryCode: Date | null;
}

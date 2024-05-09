import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Device } from '../../../public/devices/domain/device.entity';

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
    @Column({ collation: 'C' })
    login: string;
    @Column()
    email: string;
    @Column()
    desc: string;
    @Column()
    email2: string;
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

    @OneToMany(() => Device, device => device.user)
    devices: Device[];
}

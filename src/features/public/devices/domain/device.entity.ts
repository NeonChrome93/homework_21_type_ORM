import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../../admin/users/domain/user.entity';

@Entity()
export class Device {
    @Column()
    ip: string;
    @PrimaryColumn()
    deviceId: string;
    @Column()
    userId: string;
    @Column()
    title: string;
    @Column()
    lastActiveDate: Date;

    @ManyToOne(() => User, user => user.devices)
    @JoinColumn({ name: 'userId' })
    user: User;
}

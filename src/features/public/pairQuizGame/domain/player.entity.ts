import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../admin/users/domain/user.entity';
import { AnswersEntity } from './answers.entity';

@Entity()
export class PlayerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    score: number;

    @ManyToOne(() => User, user => user.player)
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(() => AnswersEntity, answer => answer.player)
    answer: AnswersEntity[];

    @Column()
    addedAt: Date;
}

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GameEntity } from './game.entity';
import { User } from '../../../admin/users/domain/user.entity';
import { AnswersEntity } from './answers.entity';

@Entity()
export class PlayerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    score: string;

    // @Column({ array: true, type: 'text' })
    // answers: string[]; это просто связь

    @OneToOne(() => GameEntity, game => game.player)
    game: GameEntity;

    @ManyToOne(() => User, user => user.player)
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(() => AnswersEntity, answer => answer.player)
    answer: AnswersEntity[];
}

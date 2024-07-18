import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ANSWER_STATUS } from '../api/models/input/game.input';
import { PlayerEntity } from './player.entity';

@Entity()
export class AnswersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    text: string;

    @Column()
    questionId: string;

    @Column()
    playerId: string;

    @Column({ type: 'enum', enum: ANSWER_STATUS })
    status: ANSWER_STATUS;

    @Column()
    addedAt: Date;

    @ManyToOne(() => PlayerEntity, player => player.answer)
    @JoinColumn({ name: 'playerId' })
    player: PlayerEntity;
}

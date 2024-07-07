import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ANSWER_STATUS } from '../api/models/input/game.input';

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

    @Column({ type: 'enum', enum: ANSWER_STATUS, default: ANSWER_STATUS.Nope })
    status: ANSWER_STATUS;

    @Column()
    addedAt: Date;
}

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ANSWER_STATUS } from '../api/models/input/game.input';
import { PlayerEntity } from './player.entity';
import { GameQuestionEntity } from '../../../admin/pairQuizGameQuestions/domain/question.entity';
import { GameEntity } from './game.entity';

export interface CreateAnswerDTO {
    text: string;
    question: GameQuestionEntity;
    player: PlayerEntity;
    isCorrect: boolean;
}

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
    //сдеалть связь как у плеера
    @ManyToOne(() => PlayerEntity, player => player.answer, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'playerId' })
    player: PlayerEntity;

    // @ManyToOne(() => GameQuestionEntity, question => question.answers)
    // @JoinColumn({ name: 'questionId' })
    // question: GameQuestionEntity;

    static create({ player, text, question, isCorrect }: CreateAnswerDTO) {
        const answer = new this();
        answer.player = player;
        answer.text = text;
        answer.playerId = player.id;
        answer.questionId = question.id;
        answer.status = isCorrect ? ANSWER_STATUS.Correct : ANSWER_STATUS.Incorrect;
        answer.addedAt = new Date();
        return answer;
    }
}

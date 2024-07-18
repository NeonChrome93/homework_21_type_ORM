import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GameEntity } from './game.entity';
import { GameQuestionEntity } from '../../../admin/pairQuizGameQuestions/domain/question.entity';

@Entity()
export class GameQuestionReference {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    questionId: string;

    @Column()
    gameId: string;

    @Column()
    index: number;

    @ManyToOne(() => GameEntity, game => game.gameQuestions)
    @JoinColumn({ name: ' gameId' })
    game: GameEntity;

    @ManyToOne(() => GameQuestionEntity, question => question.gameQuestion)
    @JoinColumn({ name: 'questionId' })
    question: GameQuestionEntity;

    // todo add index for GameQuestionEntity
    // todo add relations for entities
}

import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GameEntity } from './game.entity';
import { GameQuestionEntity } from '../../../admin/pairQuizGameQuestions/domain/question.entity';

@Entity()
export class GameQuestionReferenceEntity extends BaseEntity {
    // constructor(question: GameQuestionEntity, gameId: string) {
    //     (this.question = question), (this.gameId = gameId);
    // }

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

    @ManyToOne(() => GameQuestionEntity, question => question.gameQuestions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'questionId' })
    question: GameQuestionEntity;

    // todo add index for GameQuestionEntity
    // todo add relations for entities

    static createReference(question: GameQuestionEntity, game: GameEntity, index: number) {
        // (this.question = question), (this.gameId = gameId);
        const referenceQuestion = new this();
        // referenceQuestion.question = question;
        // referenceQuestion.game = game;
        referenceQuestion.questionId = question.id;
        referenceQuestion.gameId = game.id;
        referenceQuestion.index = index;

        return referenceQuestion;
    }
}

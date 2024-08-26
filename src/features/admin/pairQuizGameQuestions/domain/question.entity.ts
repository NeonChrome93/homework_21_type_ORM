import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GameQuestionReferenceEntity } from '../../../public/pairQuizGame/domain/gameQuestionReference.entity';
import { AnswersEntity } from '../../../public/pairQuizGame/domain/answers.entity';

@Entity()
export class GameQuestionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    body: string;

    @Column({ array: true, type: 'character varying' })
    correctAnswers: string[];

    @Column()
    published: boolean;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

    @OneToMany(() => GameQuestionReferenceEntity, gameQuestions => gameQuestions.question, { onDelete: 'CASCADE' })
    gameQuestions: GameQuestionReferenceEntity[];

    // @OneToMany(() => AnswersEntity, answers => answers.question, { onDelete: 'CASCADE' })
    // answers: AnswersEntity[];
}

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GameQuestionReference } from '../../../public/pairQuizGame/domain/gameQuestionReference';

@Entity()
export class GameQuestionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    body: string;

    @Column({ array: true, type: 'text' })
    correctAnswers: string[];

    @Column()
    published: boolean;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

    @OneToMany(() => GameQuestionReference, gameQuestion => gameQuestion.question)
    gameQuestion: GameQuestionReference[];
}

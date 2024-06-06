import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameQuestionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // @ManyToOne(() => PairQuizGame, g => g.questionGames)
    // pairQuizGame: PairQuizGame

    @Column()
    pairQuizGameId: string;

    // @ManyToOne(() => Question, q => q.questionGame)
    // question: Question

    @Column()
    index: number;
}

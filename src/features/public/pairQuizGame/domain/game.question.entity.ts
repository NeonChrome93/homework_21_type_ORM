import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameQuestionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    questionId: string;

    @Column()
    gameId: string;
}

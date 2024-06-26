import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}

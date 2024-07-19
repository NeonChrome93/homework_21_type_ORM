import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GAME_STATUS } from '../api/models/input/game.input';
import { PlayerEntity } from './player.entity';
import { GameQuestionReference } from './gameQuestionReference';

@Entity()
export class GameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => PlayerEntity)
    firstPlayerProgress: PlayerEntity;

    @OneToOne(() => PlayerEntity)
    secondPlayerProgress: PlayerEntity | null;

    @Column({ type: 'enum', enum: GAME_STATUS, default: GAME_STATUS.Pending })
    status: GAME_STATUS;

    // todo add 3 dates
    @Column()
    pairCreatedDate: Date;

    @Column({ nullable: true })
    startGameDate: Date;

    @Column({ nullable: true })
    finishGameDate: Date;

    @OneToMany(() => GameQuestionReference, gameQuestions => gameQuestions.game)
    gameQuestions: GameQuestionReference[];
}

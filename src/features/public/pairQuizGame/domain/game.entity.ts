import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GAME_STATUS } from '../api/models/input/game.input';
import { PlayerEntity } from './player.entity';
import { GameQuestionReferenceEntity } from './gameQuestionReference.entity';

@Entity()
export class GameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => PlayerEntity, { nullable: true })
    @JoinColumn()
    firstPlayerProgress: PlayerEntity;

    @OneToOne(() => PlayerEntity, { nullable: true })
    @JoinColumn()
    secondPlayerProgress: PlayerEntity;

    @Column({ type: 'enum', enum: GAME_STATUS, default: GAME_STATUS.Pending })
    status: GAME_STATUS;

    // todo add 3 dates
    @Column()
    pairCreatedDate: Date;

    @Column({ nullable: true })
    startGameDate: Date;

    @Column({ nullable: true })
    finishGameDate: Date;

    @OneToMany(() => GameQuestionReferenceEntity, gameQuestions => gameQuestions.game)
    gameQuestions: GameQuestionReferenceEntity[];
}

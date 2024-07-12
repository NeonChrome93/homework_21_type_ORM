import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GAME_STATUS } from '../api/models/input/game.input';

@Entity()
export class GameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    firstPlayerProgress: string;

    @Column({ nullable: true })
    secondPlayerProgress: string;

    @Column({ type: 'enum', enum: GAME_STATUS, default: GAME_STATUS.Pending })
    status: GAME_STATUS;

    // todo add 3 dates
    @Column()
    pairCreatedDate: Date;

    @Column({ nullable: true })
    startGameDate: Date;

    @Column({ nullable: true })
    finishGameDate: Date;
}

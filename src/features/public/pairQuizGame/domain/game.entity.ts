import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GAME_STATUS } from '../api/models/input/game.input';

@Entity()
export class GameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    firstPlayer: string;

    @Column({ nullable: true })
    secondPlayer: string;

    @Column({ type: 'enum', enum: GAME_STATUS, default: GAME_STATUS.Pending })
    status: GAME_STATUS;
}

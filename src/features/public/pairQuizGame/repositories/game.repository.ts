import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from '../domain/game.entity';
import { Repository } from 'typeorm';
import { GAME_STATUS } from '../api/models/input/game.input';
import { PlayerEntity } from '../domain/player.entity';

@Injectable()
export class GameRepository {
    constructor(
        @InjectRepository(GameEntity) public gameRepository: Repository<GameEntity>,
        @InjectRepository(PlayerEntity) public playerRepository: Repository<PlayerEntity>,
    ) {}

    async findGameByUserId(userId: string): Promise<GameEntity | null> {
        // const game: GameEntity | null = await this.gameRepository
        //     .createQueryBuilder('g')
        //     .where('g.userId = :userId', { userId: userId })
        //     .getOne();
        // return game;
        return this.gameRepository.findOne({
            where: [
                { firstPlayerProgress: { userId } },
                { secondPlayerProgress: { userId } },
                { status: GAME_STATUS.Active },
            ],
        });
    }

    async findGamePendingUser(userId: string): Promise<GameEntity | null> {
        // const game: GameEntity | null = await this.gameRepository
        //     .createQueryBuilder('g')
        //     .where('g.userId = :userId', { userId: userId })
        //     .getOne();
        // return game;
        return this.gameRepository.findOne({
            where: [{ secondPlayerProgress: { userId } }, { status: GAME_STATUS.Pending }],
        });
    }

    async createPlayer(newPlayer: Omit<PlayerEntity, 'id' | 'user' | 'answer'>) {
        return await this.playerRepository.save(newPlayer);
    }

    async createGame(newGame: Omit<GameEntity, 'id' | 'firstPlayerProgress' | 'finishGameDate'>) {
        return await this.playerRepository.save(newGame);
    }
}

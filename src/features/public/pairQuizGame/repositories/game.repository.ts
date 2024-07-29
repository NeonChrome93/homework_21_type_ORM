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
        return await this.gameRepository
            .createQueryBuilder('game')
            .where('game.firstPlayerProgress = :userId', { userId })
            .andWhere('game.status = :status', { status: GAME_STATUS.Active })
            .orWhere('game.secondPlayerProgress = :userId', { userId })
            .andWhere('game.status = :status', { status: GAME_STATUS.Active })
            .getOne();
    }

    async findGamePendingUser(): Promise<GameEntity | null> {
        // const game: GameEntity | null = await this.gameRepository
        //     .createQueryBuilder('g')
        //     .where('g.userId = :userId', { userId: userId })
        //     .getOne();
        // return game;
        return this.gameRepository.findOne({
            where: { status: GAME_STATUS.Pending },
        });
    }

    async createPlayer(newPlayer: Omit<PlayerEntity, 'id' | 'user' | 'answer'>) {
        return await this.playerRepository.save(newPlayer);
    }

    async createGame(
        newGame: Omit<
            GameEntity,
            'id' | 'firstPlayerProgress' | 'finishGameDate' | 'pairCreatedDate' | 'gameQuestions'
        >,
    ) {
        return await this.gameRepository.save(newGame);
    }
}

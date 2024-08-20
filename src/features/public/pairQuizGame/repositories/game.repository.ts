import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from '../domain/game.entity';
import { In, Repository } from 'typeorm';
import { GAME_STATUS } from '../api/models/input/game.input';
import { PlayerEntity } from '../domain/player.entity';
import { AnswersEntity } from '../domain/answers.entity';

@Injectable()
export class GameRepository {
    constructor(
        @InjectRepository(GameEntity) public gameRepository: Repository<GameEntity>,
        @InjectRepository(PlayerEntity) public playerRepository: Repository<PlayerEntity>,
        @InjectRepository(AnswersEntity) public answerRepository: Repository<AnswersEntity>,
    ) {}

    async findGameByUserId(userId: string): Promise<GameEntity | null> {
        // const game: GameEntity | null = await this.gameRepository
        //     .createQueryBuilder('g')
        //     .where('g.userId = :userId', { userId: userId })
        //     .getOne();
        // return game;

        // return await this.gameRepository
        //     .createQueryBuilder('game')
        //     .select([
        //         'game.id AS game_id',
        //         'game.status AS game_status',
        //         'game.pairCreatedDate AS game_pairCreatedDate',
        //         'game.startGameDate AS game_startGameDate',
        //         'game.finishGameDate AS game_finishGameDate',
        //         'fpp.id AS game_firstPlayerProgressId',
        //         'spp.id AS game_secondPlayerProgressId',
        //     ])
        //     .leftJoin('game.firstPlayerProgress', 'fpp')
        //     .leftJoin('game.secondPlayerProgress', 'spp')
        //
        //     .where('(fpp.userId = :userId OR spp.userId = :userId)', { userId })
        //     .andWhere('(game.status = :statusPending OR game.status = :statusActive)', {
        //         statusActive: GAME_STATUS.Active,
        //         statusPending: GAME_STATUS.Pending,
        //     })
        //     .getOne();

        return await this.gameRepository.findOne({
            relations: {
                firstPlayerProgress: {
                    user: true,
                },
                secondPlayerProgress: {
                    user: true,
                },
            },
            where: [
                {
                    firstPlayerProgress: {
                        user: {
                            id: userId,
                        },
                    },
                    status: In([GAME_STATUS.Active, GAME_STATUS.Pending]),
                },
                {
                    secondPlayerProgress: {
                        user: {
                            id: userId,
                        },
                    },
                    status: In([GAME_STATUS.Active, GAME_STATUS.Pending]),
                },
            ],
        });

        //.посмотреть скобочки TypeORM
    }

    async findGamePendingUser(userId: string): Promise<GameEntity | null> {
        // const game: GameEntity | null = await this.gameRepository
        //     .createQueryBuilder('g')
        //     .where('g.userId = :userId', { userId: userId })
        //     .getOne();
        // return game;
        return this.gameRepository.findOne({
            where: { status: GAME_STATUS.Pending },
            //userId: Not(userId),
        });
    }

    async createPlayer(newPlayer: Omit<PlayerEntity, 'id' | 'user' | 'answer'>) {
        return await this.playerRepository.save(newPlayer);
    }

    async createAnswer(answer: Omit<AnswersEntity, 'id' | 'text' | 'status' | 'player'>) {
        return await this.answerRepository.save(answer);
    }

    async createGame(
        newGame: Omit<GameEntity, 'id' | 'secondPlayerProgress' | 'finishGameDate' | 'gameQuestions' | 'startGameDate'>,
    ) {
        return await this.gameRepository.save(newGame);
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { GameEntity } from '../domain/game.entity';
import { GameModel } from '../api/models/output/game.output';
import { PlayerEntity } from '../domain/player.entity';
import { GAME_STATUS } from '../api/models/input/game.input';

@Injectable()
export class GameQueryRepository {
    constructor(
        @InjectRepository(GameEntity) public gameQueryRepository: Repository<GameEntity>,
        @InjectRepository(PlayerEntity) public playerQueryRepository: Repository<PlayerEntity>,
    ) {}

    async currentGame() {}

    async getGameById(id: string): Promise<GameModel | null> {
        const gameEntity: GameEntity = await this.gameQueryRepository.findOne({
            relations: {
                firstPlayerProgress: { user: true, answer: true },
                secondPlayerProgress: { user: true, answer: true },
                gameQuestions: { question: { gameQuestions: true } },
            },
            select: {
                id: true,
                firstPlayerProgress: {
                    id: true,
                    user: { id: true, login: true },
                    score: true,
                    answer: {
                        id: true,
                        questionId: true,
                        status: true,
                        addedAt: true, //сортироывка
                    },
                },
                secondPlayerProgress: {
                    id: true,
                    user: { id: true, login: true },
                    score: true,
                    answer: {
                        id: true,
                        questionId: true,
                        status: true,
                        addedAt: true, //сортировка
                    },
                },
                gameQuestions: {
                    id: true,
                    index: true,
                    question: {
                        id: true,
                        body: true,
                    },
                },
                status: true,
                pairCreatedDate: true,
                startGameDate: true,
                finishGameDate: true,
            },
            where: { id },
            order: {
                gameQuestions: { index: 'ASC' },
                firstPlayerProgress: { answer: { addedAt: 'ASC' } },
                secondPlayerProgress: { answer: { addedAt: 'ASC' } },
            },
        });

        // if (!getGameById) return null;
        //
        // const currentUnFinishedGameFirstPlayer = await this.playerQueryRepository.findOne({
        //     relations: {
        //         user: { progressPlayer: true },
        //         answers: { progress: true },
        //     },
        //     where: {
        //         gameId: id,
        //         user: { id: getGameById.firstPlayerProgress.user.id },
        //     },
        //     order: { answers: { addedAt: 'ASC' } },
        // });
        //
        // const currentUnFinishedGameSecondPlayer = getGameById.secondPlayerProgress
        //     ? await this.playerQueryRepository.findOne({
        //           relations: {
        //               user: { progressPlayer: true },
        //               answers: { progress: true },
        //           },
        //           where: {
        //               gameId: id,
        //               user: { id: getGameById.secondPlayerProgress.user.id },
        //           },
        //           order: { answers: { addedAt: 'ASC' } },
        //       })
        //     : null;
        if (!gameEntity) {
            return null;
        }

        return this.mapToGameModel(gameEntity);
    }

    async findCurrentGameByUserId(userId: string): Promise<GameModel | null> {
        const game: GameEntity = await this.gameQueryRepository.findOne({
            relations: {
                firstPlayerProgress: { user: true, answer: true },
                secondPlayerProgress: { user: true, answer: true },
                gameQuestions: { question: { gameQuestions: true } },
            },
            // select: {
            //     id: true,
            //     firstPlayerProgress: {
            //         id: true,
            //         user: { id: true, login: true },
            //         score: true,
            //         answer: {
            //             id: true,
            //             questionId: true,
            //             status: true,
            //             addedAt: true, //сортироывка
            //         },
            //     },
            //     secondPlayerProgress: {
            //         id: true,
            //         user: { id: true, login: true },
            //         score: true,
            //         answer: {
            //             id: true,
            //             questionId: true,
            //             status: true,
            //             addedAt: true, //сортировка
            //         },
            //     },
            //     gameQuestions: {
            //         id: true,
            //         index: true,
            //         question: {
            //             id: true,
            //             body: true,
            //         },
            //     },
            //     status: true,
            //     pairCreatedDate: true,
            //     startGameDate: true,
            //     finishGameDate: true,
            // },
            order: {
                gameQuestions: { index: 'ASC' },
                firstPlayerProgress: { answer: { addedAt: 'ASC' } },
                secondPlayerProgress: { answer: { addedAt: 'ASC' } },
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
        if (!game) return null;
        return this.mapToGameModel(game);
    }

    private mapToGameModel(gameEntity: GameEntity): GameModel {
        return {
            id: gameEntity.id,
            firstPlayerProgress: {
                answers: gameEntity.firstPlayerProgress.answer.map(answer => ({
                    questionId: answer.questionId,
                    answerStatus: answer.status,
                    addedAt: answer.addedAt.toISOString(),
                })),
                player: {
                    id: gameEntity.firstPlayerProgress.user.id,
                    login: gameEntity.firstPlayerProgress.user.login,
                },
                score: gameEntity.firstPlayerProgress.score,
            },
            secondPlayerProgress: gameEntity.secondPlayerProgress
                ? {
                      answers: gameEntity.secondPlayerProgress.answer.map(answer => ({
                          questionId: answer.questionId,
                          answerStatus: answer.status,
                          addedAt: answer.addedAt.toISOString(),
                      })),
                      player: {
                          id: gameEntity.secondPlayerProgress.user.id,
                          login: gameEntity.secondPlayerProgress.user.login,
                      },
                      score: gameEntity.secondPlayerProgress.score,
                  }
                : null,
            questions: gameEntity.gameQuestions.length
                ? gameEntity.gameQuestions.map(gq => ({
                      id: gq.question.id,
                      body: gq.question.body,
                  }))
                : null,
            status: gameEntity.status,
            pairCreatedDate: gameEntity.pairCreatedDate?.toISOString() ?? null,
            startGameDate: gameEntity.startGameDate?.toISOString() ?? null,
            finishGameDate: gameEntity.finishGameDate?.toISOString() ?? null,
        };
    }
}

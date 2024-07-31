import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameEntity } from '../domain/game.entity';
import { GameModel } from '../api/models/output/game.output';
import { PlayerEntity } from '../domain/player.entity';
import { GameQuestionReferenceEntity } from '../domain/gameQuestionReference.entity';

@Injectable()
export class GameQueryRepository {
    constructor(
        @InjectRepository(GameEntity) public gameQueryRepository: Repository<GameEntity>,
        @InjectRepository(PlayerEntity) public playerQueryRepository: Repository<PlayerEntity>,
    ) {}

    async currentGame() {}

    async getGameById(id: string): Promise<GameModel | null> {
        const getGameById: GameEntity = await this.gameQueryRepository.findOne({
            relations: {
                firstPlayerProgress: { user: true, answer: { player: true } },
                secondPlayerProgress: { user: true, answer: { player: true } },
                gameQuestions: { question: { gameQuestions: true } },
            },
            where: { id },
            order: { GameQuestionReferenceEntity: { index: 'ASC' } },
        });

        if (!getGameById) return null;

        const currentUnFinishedGameFirstPlayer = await this.playerQueryRepository.findOne({
            relations: {
                user: { progressPlayer: true },
                answers: { progress: true },
            },
            where: {
                gameId: id,
                user: { id: getGameById.firstPlayerProgress.user.id },
            },
            order: { answers: { addedAt: 'ASC' } },
        });

        const currentUnFinishedGameSecondPlayer = getGameById.secondPlayerProgress
            ? await this.pairQuizGameProgressPlayer.findOne({
                  relations: {
                      user: { progressPlayer: true },
                      answers: { progress: true },
                  },
                  where: {
                      gameId: id,
                      user: { id: getGameById.secondPlayerProgress.user.id },
                  },
                  order: { answers: { addedAt: 'ASC' } },
              })
            : null;

        return PairQuizGame.getViewModels(
            getGameById,
            currentUnFinishedGameFirstPlayer,
            currentUnFinishedGameSecondPlayer,
        );
    }
}

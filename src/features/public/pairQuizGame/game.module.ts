import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PairGameQuizController } from './api/game.controller';
import { GameQueryRepository } from './repositories/game.query.repository';
import { CreateGameUseCase } from './application/usecases/create-game.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './domain/game.entity';
import { PlayerEntity } from './domain/player.entity';
import { AnswersEntity } from './domain/answers.entity';
import { GameQuestionReferenceEntity } from './domain/gameQuestionReference.entity';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([GameEntity, AnswersEntity, PlayerEntity, GameQuestionReferenceEntity]),
    ],
    providers: [CreateGameUseCase, GameQueryRepository],
    controllers: [PairGameQuizController],
})
export class GameModule {}

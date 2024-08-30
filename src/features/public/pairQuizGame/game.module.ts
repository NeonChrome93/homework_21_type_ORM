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
import { QuestionRepository } from '../../admin/pairQuizGameQuestions/repositories/question.repository';
import { GameRepository } from './repositories/game.repository';
import { QuestionModule } from '../../admin/pairQuizGameQuestions/question.module';
import { AuthModule } from '../../admin/users/auth.module';
import { CreateAnswerUseCase } from './application/usecases/create-answer.usecase';

@Module({
    imports: [
        CqrsModule,
        AuthModule,
        QuestionModule,
        TypeOrmModule.forFeature([GameEntity, AnswersEntity, PlayerEntity, GameQuestionReferenceEntity]),
    ],
    providers: [CreateGameUseCase, CreateAnswerUseCase, GameQueryRepository, GameRepository, QuestionRepository],
    controllers: [PairGameQuizController],
})
export class GameModule {}

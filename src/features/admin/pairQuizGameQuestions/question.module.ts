import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameQuestionEntity } from './domain/question.entity';
import { QuizQuestionsController } from './api/question.controller';
import { QuestionRepository } from './repositories/question.repository';
import { CreateQuestionUseCase } from './application/usecases/create-question.usecase';
import { QuestionQueryRepository } from './repositories/question.query.repository';
import { DeleteQuestionUseCase } from './application/usecases/delete-question.usecase';
import { UpdateQuestionUseCase } from './application/usecases/update-question.usecase';
import { PublishQuestionUseCase } from './application/usecases/publish-question.usecase';
import { GameQuestionReferenceEntity } from '../../public/pairQuizGame/domain/gameQuestionReference.entity';

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([GameQuestionEntity, GameQuestionReferenceEntity])],
    providers: [
        QuestionRepository,
        CreateQuestionUseCase,
        DeleteQuestionUseCase,
        UpdateQuestionUseCase,
        PublishQuestionUseCase,
        QuestionQueryRepository,
    ],
    controllers: [QuizQuestionsController],
    exports: [TypeOrmModule],
})
export class QuestionModule {}

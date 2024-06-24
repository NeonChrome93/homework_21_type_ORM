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

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([GameQuestionEntity])],
    providers: [
        QuestionRepository,
        CreateQuestionUseCase,
        DeleteQuestionUseCase,
        UpdateQuestionUseCase,
        PublishQuestionUseCase,
        QuestionQueryRepository,
    ],
    controllers: [QuizQuestionsController],
    exports: [],
})
export class QuestionModule {}

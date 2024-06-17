import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameQuestionEntity } from './domain/question.entity';
import { QuizQuestionsController } from './api/question.controller';
import { QuestionRepository } from './repositories/question.repository';
import { CreateQuestionUseCase } from './application/usecases/create-question.usecase';

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([GameQuestionEntity])],
    providers: [QuestionRepository, CreateQuestionUseCase],
    controllers: [QuizQuestionsController],
    exports: [],
})
export class QuestionModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameQuestionEntity } from '../domain/question.entity';
import { PublishedQuestionDto, UpdateQuestionDto } from '../api/models/input/input-question';
import { GameQuestionReferenceEntity } from '../../../public/pairQuizGame/domain/gameQuestionReference.entity';

@Injectable()
export class QuestionRepository {
    constructor(
        @InjectRepository(GameQuestionEntity) public questionRepository: Repository<GameQuestionEntity>,
        @InjectRepository(GameQuestionReferenceEntity)
        public questionReferenceRepository: Repository<GameQuestionReferenceEntity>,
    ) {}

    async createQuestion(newQuestion: Omit<GameQuestionEntity, 'id' | 'gameQuestions'>): Promise<GameQuestionEntity> {
        //const createdQuestion = this.questionRepository.create(newQuestion);
        return await this.questionRepository.save(newQuestion);
    }
    async connectQuestionsToGame(questions: GameQuestionReferenceEntity[]) {
        //repo/save(questions)
        return await this.questionReferenceRepository.save(questions);
    }

    async readQuestionById(id: string): Promise<GameQuestionEntity | null> {
        const question: GameQuestionEntity | null = await this.questionRepository
            .createQueryBuilder('q')
            .where('q.id = :id', { id: id })
            .getOne();
        return question;
    }

    async deleteQuestion(id: string) {
        const question = await this.questionRepository
            .createQueryBuilder()
            .delete()
            .from(GameQuestionEntity)
            .where('id = :id', { id: id })
            .execute();

        if (!question) return false;
        return true;
    }

    async updateQuestion(id: string, dto: UpdateQuestionDto): Promise<boolean> {
        const question = await this.questionRepository.update(
            { id: id },
            {
                body: dto.body,
                correctAnswers: dto.correctAnswers,
                updatedAt: new Date(),
            },
        );
        if (!question) return false;
        return true;
    }

    async publishQuestion(id: string, dto: PublishedQuestionDto): Promise<boolean> {
        const question = await this.questionRepository.update(
            { id: id },
            {
                published: dto.published,
                updatedAt: new Date(),
            },
        );
        if (!question) return false;
        return true;
    }

    async getFiveQuestions(): Promise<GameQuestionEntity[]> {
        const questions = await this.questionRepository
            .createQueryBuilder('game_question_entity')
            .orderBy('RANDOM()')
            .limit(5)
            .getMany();

        return questions;
    }
}

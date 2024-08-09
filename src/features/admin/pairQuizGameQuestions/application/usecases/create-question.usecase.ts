import { CreateGameQuestionDto } from '../../api/models/input/input-question';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameQuestionEntity } from '../../domain/question.entity';
import { QuestionRepository } from '../../repositories/question.repository';
import { QuestionViewType } from '../../api/models/output/output-question';

export class CreateQuestionCommand {
    constructor(public dto: CreateGameQuestionDto) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase implements ICommandHandler<CreateQuestionCommand> {
    constructor(private readonly questionRepository: QuestionRepository) {}

    async execute(command: CreateQuestionCommand): Promise<QuestionViewType> {
        const newQuestion: Omit<GameQuestionEntity, 'id' | 'gameQuestions'> = {
            body: command.dto.body,
            correctAnswers: command.dto.correctAnswers,
            published: false,
            createdAt: new Date(),
            updatedAt: null,
        };

        const questionId = await this.questionRepository.createQuestion(newQuestion);

        return {
            id: questionId.id,
            body: questionId.body,
            correctAnswers: questionId.correctAnswers,
            published: questionId.published,
            createdAt: questionId.createdAt.toISOString(),
            updatedAt: questionId.updatedAt ? questionId.updatedAt.toISOString() : null,
        };
    }
}

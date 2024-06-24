import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepository } from '../../repositories/question.repository';
import { PublishedQuestionDto } from '../../api/models/input/input-question';

export class PublishQuestionCommand {
    constructor(
        public id: string,
        public dto: PublishedQuestionDto,
    ) {}
}

@CommandHandler(PublishQuestionCommand)
export class PublishQuestionUseCase implements ICommandHandler<PublishQuestionCommand> {
    constructor(private readonly questionRepository: QuestionRepository) {}
    async execute(command: PublishQuestionCommand): Promise<boolean> {
        const { id, dto } = command;
        const question = await this.questionRepository.readQuestionById(id);
        if (!question) return false;

        return this.questionRepository.publishQuestion(id, dto);
    }
}

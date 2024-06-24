import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepository } from '../../repositories/question.repository';

export class DeleteQuestionCommand {
    constructor(public id: string) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase implements ICommandHandler<DeleteQuestionCommand> {
    constructor(private readonly questionRepository: QuestionRepository) {}

    async execute(command: DeleteQuestionCommand): Promise<boolean> {
        const question = await this.questionRepository.readQuestionById(command.id);
        if (!question) return false;
        return this.questionRepository.deleteQuestion(command.id);
    }
}

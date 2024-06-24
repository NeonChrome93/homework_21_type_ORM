import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateQuestionDto } from '../../api/models/input/input-question';
import { QuestionRepository } from '../../repositories/question.repository';

export class UpdateQuestionCommand {
    constructor(
        public id: string,
        public dto: UpdateQuestionDto,
    ) {}
}
@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase implements ICommandHandler<UpdateQuestionCommand> {
    constructor(private readonly questionRepository: QuestionRepository) {}
    async execute(command: UpdateQuestionCommand): Promise<boolean> {
        const question = await this.questionRepository.readQuestionById(command.id);
        if (!question) return false;

        return this.questionRepository.updateQuestion(command.id, command.dto);
    }
}

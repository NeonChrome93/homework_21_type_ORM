import { CreateGameQuestionDto } from '../../api/models/input';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameQuestionEntity } from '../../domain/question.entity';

export class CreateQuestionCommand {
    constructor(public dto: CreateGameQuestionDto) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase implements ICommandHandler<CreateQuestionCommand> {
    constructor() {}

    execute(command: CreateQuestionCommand): Promise<any> {
        const newQuestion: GameQuestionEntity = {};
    }
}

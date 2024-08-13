import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '../../repositories/game.repository';
import { NotFoundException } from '@nestjs/common';

export class AnswerCommand {
    constructor(
        public userId: string,
        public answer: string,
    ) {}
}

@CommandHandler(AnswerCommand)
export class CreateAnswerUseCase implements ICommandHandler<AnswerCommand> {
    constructor(private readonly gameRepository: GameRepository) {}

    async execute(command: AnswerCommand) {
        const activeGame = await this.gameRepository.findGameByUserId(command.userId);

        if (activeGame.status !== 'Active') {
            throw new NotFoundException('Game not found or is not active');
        }

        const player = activeGame.firstPlayerProgress.userId ? 'playerOne' : null ?
          activeGame.secondPlayerProgress.userId ? 'playerTwo' : null;

          if(!player) {
              throw new NotFoundException('Player not found')
          }

    }


    //мне приходит ответ в бади, по токену определяю кто ответил, существует ли эта игра,
    // определяю кто он конкретно первый или второй, сранивниваю массив ответов игры и массив вопросов плеера определяю на какой конретно ответ ждется вопрос.
    // По айти вопроса иду в базу достаю его и сравниваю его ответ с корретным ответом из массива в базе. Добавляю баллы. Создаю сущность ответа и сохраняю
    // в базе и возвращаю результает
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '../../repositories/game.repository';
import { ForbiddenException } from '@nestjs/common';
import { PlayerEntity } from '../../domain/player.entity';
import { GameEntity } from '../../domain/game.entity';
import { GAME_STATUS } from '../../api/models/input/game.input';
import { QuestionRepository } from '../../../../admin/pairQuizGameQuestions/repositories/question.repository';
import { GameQuestionReferenceEntity } from '../../domain/gameQuestionReference.entity';
import { GameQuestionEntity } from '../../../../admin/pairQuizGameQuestions/domain/question.entity';

export class CreateGameCommand {
    constructor(public userId: string) {}
}

@CommandHandler(CreateGameCommand)
export class CreateGameUseCase implements ICommandHandler<CreateGameCommand> {
    constructor(
        private readonly gameRepository: GameRepository,
        private readonly questionRepository: QuestionRepository,
    ) {}
    // статуса всего три и только у игры
    async execute(command: CreateGameCommand) {
        // пойти в базу найти игру в которой игрок с юзерайди из токена уже учавствует
        // если нет тогда идем в базу и ищем игру с статусом PendingSecondUser
        const gameIsActive = await this.gameRepository.findGameByUserId(command.userId);
        // если есть такая игра то 403
        if (gameIsActive) throw new ForbiddenException('User is already participating in a game');
        // если нет тогда идем в базу и ищем игру с статусом PendingSecondUser
        const gamePending = await this.gameRepository.findGamePendingUser();
        // Если находим то в secondPlayerProgress добавляем игрка (создаем сущность плеера в базе)
        //создаем игру
        if (gamePending) {
            const secondPlayer: Omit<PlayerEntity, 'id' | 'user' | 'answer'> = {
                userId: command.userId,
                score: 0,
                addedAt: new Date(),
            };

            const createPlayer = await this.gameRepository.createPlayer(secondPlayer);
            const createQuestions: GameQuestionEntity[] = await this.questionRepository.getFiveQuestions();
            const gameCreateObj: Omit<
                GameEntity,
                'id' | 'firstPlayerProgress' | 'finishGameDate' | 'pairCreatedDate' | 'gameQuestions'
            > = {
                secondPlayerProgress: createPlayer,
                status: GAME_STATUS.Active,
                startGameDate: new Date(),
                //gameQuestions: createQuestions,
            };
            //соединить 5 рандомных вопроса из createQuestions с игрой: для этого нужно создать для каждого вопроса Reference к этой игре

            //toReference.save() //со[ранить массив
            const createGame = await this.gameRepository.createGame(gameCreateObj);
            const toReference = createQuestions.map(
                question => new GameQuestionReferenceEntity(question, createGame.id),
            );
        } else {
            // Если не находим создаем сущность плеера создаем сущность игры , записываем игрока в firstPlayerProgress
            const firstPlayer: Omit<PlayerEntity, 'id' | 'user' | 'answer'> = {
                userId: command.userId,
                score: 0,
                addedAt: new Date(),
            };

            const createPlayer = await this.gameRepository.createPlayer(firstPlayer);
            const gameCreateObj: Omit<GameEntity, 'id' | 'secondPlayerProgress' | 'finishGameDate' | 'gameQuestions'> =
                {
                    firstPlayerProgress: createPlayer,
                    status: GAME_STATUS.Pending,
                    startGameDate: new Date(),
                    // ставим дату PairCreationDate
                    pairCreatedDate: new Date(),
                };
            const createGame = await this.gameRepository.createGame(gameCreateObj);
        }

        //создаем игру
        // Если находим то в secondPlayerProgress добавляем игрка (создаем сущность плеера в базе)
        // записываем дату старта игры меняем статус на Active и идем в базу и ищем 5 рандомных опубликованых вопросов (ORDER BY Random())
        // и все 201
        // Если ненаходим создаем сущность плеера создаем сущность игры , записываем игрока в firstPlayerProgress
        // ставим статус игры ПендингСекондПлеер
        // ставим дату PairCreationDate
    }
    // todo dockerfile dockercomposefile docker swarn docker standalone jenkinsfile CI/CD
    // TODO  НА ПРАКТИКЕ УМЕТЬ ПОДНЯТЬ БАЗУ МОНГО ПОСТГРЕС РЕДИС  ТВОЕ ПРИЛОЖЕНИЕ И NGINX ДЛЯ ПРОКСИРОВАНИЯ
    // ZABBIX GRAFANA TERRAFORM
}

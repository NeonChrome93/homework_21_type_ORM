import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateGameCommand {
    constructor() {}
}

@CommandHandler(CreateGameCommand)
export class CreateGameUseCase implements ICommandHandler<CreateGameCommand> {
    constructor() {}
    // статуса всего три и только у игры

    // пойти в базу найти игру в которой игрок с юзерайди из токена уже учавствует
    // если есть такая игра то 403

    // если нет тогда идем в базу и ищем игру с статусом PendingSecondUser

    // Если находим то в secondPlayerProgress добавляем игрка (создаем сущность плеера в базе)
    // записываем дату старта игры меняем статус на Active и идем в базу и ищем 5 рандомных опубликованых вопросов (ORDER BY Random())
    // и все 201

    // Если ненаходим создаем сущность плеера создаем сущность игры , записываем игрока в firstPlayerProgress
    // ставим статус игры ПендингСекондПлеер
    // ставим дату PairCreationDate

    // todo dockerfile dockercomposefile docker swarn docker standalone jenkinsfile CI/CD
    // TODO  НА ПРАКТИКЕ УМЕТЬ ПОДНЯТЬ БАЗУ МОНГО ПОСТГРЕС РЕДИС  ТВОЕ ПРИЛОЖЕНИЕ И NGINX ДЛЯ ПРОКСИРОВАНИЯ
    // ZABBIX GRAFANA TERRAFORM
}

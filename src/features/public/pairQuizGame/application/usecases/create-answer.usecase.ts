import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '../../repositories/game.repository';
import { ForbiddenException } from '@nestjs/common';
import { AnswersEntity } from '../../domain/answers.entity';
import { ANSWER_STATUS } from '../../api/models/input/game.input';

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
        if (activeGame?.status !== 'Active') {
            throw new ForbiddenException('Game not found or is not active');
        }
        console.log('Game', activeGame);
        const player: 'playerOne' | 'playerTwo' =
            activeGame.firstPlayerProgress.user.id === command.userId
                ? 'playerOne'
                : activeGame.secondPlayerProgress.user.id === command.userId
                  ? 'playerTwo'
                  : null;

        console.log('Player', player);
        if (player === 'playerOne') {
            const answers = await this.gameRepository.findAnswers(activeGame.firstPlayerProgress.id);
            const answerIndex = answers.length;
            //если длина маасива отиветов равна 5 то Forbidden Exp
            if (answerIndex >= 5) {
                throw new ForbiddenException('Answers more than 5');
            }
            const questionToAnswer = activeGame.gameQuestions[answerIndex].question;
            const isCorrect = questionToAnswer.correctAnswers.includes(command.answer);
            //const score = activeGame.firstPlayerProgress.score++;
            const newAnswer = AnswersEntity.create({
                player: activeGame.firstPlayerProgress,
                question: questionToAnswer,
                isCorrect,
                text: command.answer,
            });
            const answer = await this.gameRepository.createAnswer(newAnswer); //суда передать уже созданный обьект который является интансом ансвера
            await this.gameRepository.incrementPlayerScore(activeGame.firstPlayerProgress.id, Number(isCorrect));
            // activeGame.firstPlayerProgress.answer.push(answer); // либо пойти в базу и достать по айди
            const updatedGame = await this.gameRepository.findGameById(activeGame.id);
            if (
                updatedGame.secondPlayerProgress.answer.length === 5 &&
                updatedGame.firstPlayerProgress.answer.length === 5
            )
                await this.gameRepository.finishGame(updatedGame);
            return {
                questionId: questionToAnswer.id,
                answerStatus: newAnswer.status,
                addedAt: newAnswer.addedAt.toISOString(),
            };

            //связатать ответ с плеером и ответ с вопросом и сделать метод как  GameQuestionReferenceEntity только в ансвере,
            // сохранить в базе в любом случак и в зависмости от правильености ответа обновить score +1 а если неправильно +0, тоже самое для второго игрока
            //и вернуть вью модель
        } else if (player === 'playerTwo') {
            const answers = await this.gameRepository.findAnswers(activeGame.secondPlayerProgress.id);
            console.log('ansWERS', answers);
            //const answerIndex = activeGame.secondPlayerProgress.answer.length;
            const answerIndex = answers.length;
            console.log('answerIndex', answerIndex);
            console.log('activeGameAnswer', activeGame.secondPlayerProgress);
            //если длина маасива отиветов равна 5 то Forbidden Exp
            if (answerIndex >= 5) {
                throw new ForbiddenException('Answers more than 5');
            }
            const questionToAnswer = activeGame.gameQuestions[answerIndex]?.question;
            console.log('QuesToAnswer', questionToAnswer);
            if (!questionToAnswer) {
                throw new ForbiddenException('Question not found or not available');
            }

            const isCorrect = questionToAnswer.correctAnswers.includes(command.answer);
            console.log('USER', activeGame.secondPlayerProgress.user.id);
            //const score = activeGame.firstPlayerProgress.score++;
            const newAnswer = AnswersEntity.create({
                player: activeGame.secondPlayerProgress,
                question: questionToAnswer,
                isCorrect,
                text: command.answer,
            });
            const answer = await this.gameRepository.createAnswer(newAnswer); //суда передать уже созданный обьект который является интансом ансвера
            console.log('ANSWER', answer);
            await this.gameRepository.incrementPlayerScore(
                activeGame.secondPlayerProgress.id,
                Number(newAnswer.status === ANSWER_STATUS.Correct),
            );
            const updatedGame = await this.gameRepository.findGameById(activeGame.id);
            if (
                updatedGame.secondPlayerProgress.answer.length === 5 &&
                updatedGame.firstPlayerProgress.answer.length === 5
            )
                await this.gameRepository.finishGame(updatedGame);

            return {
                questionId: questionToAnswer.id,
                answerStatus: newAnswer.status,
                addedAt: newAnswer.addedAt.toISOString(),
            };
        }
    }

    //мне приходит ответ в бади, по токену определяю кто ответил, существует ли эта игра,
    // определяю кто он конкретно первый или второй, сранивниваю массив ответов игры и массив вопросов плеера определяю на какой конретно ответ ждется вопрос.
    // По айти вопроса иду в базу достаю его и сравниваю его ответ с корретным ответом из массива в базе. Добавляю баллы. Создаю сущность ответа и сохраняю
    // в базе и возвращаю результает
}

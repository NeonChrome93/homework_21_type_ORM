import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BearerAuthGuard } from '../../../../infrastructure/guards/user.guard';
import { UserId } from '../../../../infrastructure/decorators/get-user.decorator';
import { CreateGameCommand } from '../application/usecases/create-game.usecase';
import { GameQueryRepository } from '../repositories/game.query.repository';

@Controller('pair-game-quiz/pairs')
export class PairGameQuizController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly gameQueryRepo: GameQueryRepository,
    ) {}

    @Get('my-current')
    async getCurrentGame() {
        const currentGame = await this.commandBus.execute(null); //.getCurrentGame();
        if (!currentGame) {
            throw new NotFoundException('No active pair for current user');
        }
        return currentGame;
    }
    @UseGuards(BearerAuthGuard)
    @Get(':id')
    async getGameById(@Param('id', ParseUUIDPipe) id: string, @UserId() userId: string) {
        const game = await this.gameQueryRepo.getGameById(id); //getGameById(id);
        //нужно проверить что юзер айти из токена совпадает с юзер ид из плееров в этой игре, добавить гард
        if (!game) {
            throw new NotFoundException('Game not found');
        } else if (game.firstPlayerProgress.player.id !== userId && game.secondPlayerProgress?.player?.id !== userId) {
            throw new ForbiddenException('User not found');
        }
        return game;
    }

    @Post('connection')
    @UseGuards(BearerAuthGuard)
    //@HttpCode(201)
    async connectOrCreatePair(@UserId() userId: string) {
        try {
            return await this.commandBus.execute(new CreateGameCommand(userId));
        } catch (error) {
            if (error.message === 'User already in active pair') {
                throw new ForbiddenException('Current user is already participating in active pair');
            }
            throw error;
        }
    }

    @Post('my-current/answers')
    //мне приходит ответ в бади, по токену определяю кто ответил, существует ли эта игра,
    // определяю кто он конкретно первый или второй, сранивниваю массив ответов игры и массив вопросов плеера определяю на какой конретно ответ ждется вопрос.
    // По айти вопроса иду в базу достаю его и сравниваю его ответ с корретным ответом из массива в базе. Добавляю баллы. Создаю сущность ответа и сохраняю в базе и возвращаю результает
    async sendAnswer(@Body('answer') answer: string) {
        try {
            return await this.commandBus.execute(null); //sendAnswer(answer);
        } catch (error) {
            if (
                error.message === 'User not in active pair' ||
                error.message === 'User has already answered all questions'
            ) {
                throw new ForbiddenException(error.message);
            }
            throw error;
        }
    }
}

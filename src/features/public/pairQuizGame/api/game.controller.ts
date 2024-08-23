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
import { AnswerCommand, CreateAnswerUseCase } from '../application/usecases/create-answer.usecase';

@Controller('pair-game-quiz/pairs')
export class PairGameQuizController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly gameQueryRepo: GameQueryRepository,
    ) {}

    @Get('my-current')
    @UseGuards(BearerAuthGuard)
    async getCurrentGame(@UserId() userId: string) {
        //const currentGame = await this.commandBus.execute(null); //.getCurrentGame();
        const currentGame = await this.gameQueryRepo.findCurrentGameByUserId(userId);
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
    @UseGuards(BearerAuthGuard)
    async sendAnswer(@Body('answer') answer: string, @UserId() userId: string) {
        try {
            return await this.commandBus.execute(new AnswerCommand(userId, answer)); //sendAnswer(answer);
        } catch (error) {
            if (
                error.message === 'Game not found or is not active' ||
                error.message === 'User has already answered all questions'
            ) {
                throw new ForbiddenException(error.message);
            }
            throw error;
        }
    }
}

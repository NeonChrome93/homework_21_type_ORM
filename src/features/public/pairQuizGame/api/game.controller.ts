import { Body, Controller, ForbiddenException, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BearerAuthGuard } from '../../../../infrastructure/guards/user.guard';
import { UserId } from '../../../../infrastructure/decorators/get-user.decorator';
import { CreateGameCommand } from '../application/usecases/create-game.usecase';

@Controller('pair-game-quiz/pairs')
export class PairGameQuizController {
    constructor(private readonly commandBus: CommandBus) {}

    @Get('my-current')
    async getCurrentGame() {
        const currentGame = await this.commandBus.execute(null); //.getCurrentGame();
        if (!currentGame) {
            throw new NotFoundException('No active pair for current user');
        }
        return currentGame;
    }

    @Get(':id')
    async getGameById(@Param('id') id: string) {
        const game = await this.commandBus.execute(null); //getGameById(id);
        if (!game) {
            throw new NotFoundException('Game not found');
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

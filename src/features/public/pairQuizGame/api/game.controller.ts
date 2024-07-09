import { Body, Controller, ForbiddenException, Get, NotFoundException, Param, Post } from '@nestjs/common';

@Controller('pair-game-quiz/pairs')
export class PairGameQuizController {
    constructor(private readonly pairGameQuizService: PairGameQuizService) {}

    @Get('my-current')
    getCurrentGame() {
        const currentGame = this.pairGameQuizService.getCurrentGame();
        if (!currentGame) {
            throw new NotFoundException('No active pair for current user');
        }
        return currentGame;
    }

    @Get(':id')
    getGameById(@Param('id') id: string) {
        const game = this.pairGameQuizService.getGameById(id);
        if (!game) {
            throw new NotFoundException('Game not found');
        }
        return game;
    }

    @Post('connection')
    connectOrCreatePair() {
        try {
            return this.pairGameQuizService.connectOrCreatePair();
        } catch (error) {
            if (error.message === 'User already in active pair') {
                throw new ForbiddenException('Current user is already participating in active pair');
            }
            throw error;
        }
    }

    @Post('my-current/answers')
    sendAnswer(@Body('answer') answer: string) {
        try {
            return this.pairGameQuizService.sendAnswer(answer);
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

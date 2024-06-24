import {
    Controller,
    Get,
    Post,
    Delete,
    Put,
    Param,
    Body,
    HttpCode,
    NotFoundException,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    CreateGameQuestionDto,
    PublishedQuestionDto,
    QuestionQueryType,
    UpdateQuestionDto,
} from './models/input/input-question';
import { CommandBus } from '@nestjs/cqrs';
import { CreateQuestionCommand } from '../application/usecases/create-question.usecase';
import { getQueryPagination } from '../../../../utils/pagination';
import { QuestionQueryRepository } from '../repositories/question.query.repository';
import { DeleteQuestionCommand } from '../application/usecases/delete-question.usecase';
import { UpdateQuestionCommand } from '../application/usecases/update-question.usecase';
import { PublishQuestionCommand } from '../application/usecases/publish-question.usecase';
import { BasicAuthGuard } from '../../../../infrastructure/guards/basic-auth.guard';

@Controller('sa/quiz/questions')
export class QuizQuestionsController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly questionQueryRepository: QuestionQueryRepository,
    ) {}
    @Get()
    @UseGuards(BasicAuthGuard)
    async getAllQuestions(@Query() queryDto: QuestionQueryType) {
        // реализация метода для получения всех вопросов с пагинацией и фильтрацией
        const pagination = getQueryPagination(queryDto);
        const question = await this.questionQueryRepository.findAllQuestions(pagination);
        return question;
    }

    @Post()
    @UseGuards(BasicAuthGuard)
    @HttpCode(201)
    async createQuestion(@Body() dto: CreateGameQuestionDto) {
        // реализация метода для создания вопроса
        const question = await this.commandBus.execute(new CreateQuestionCommand(dto));
        return question;
    }

    @Delete(':id')
    @UseGuards(BasicAuthGuard)
    @HttpCode(204)
    async deleteQuestion(@Param('id') id: string) {
        const isDeleted = await this.commandBus.execute(new DeleteQuestionCommand(id));
        if (!isDeleted) {
            throw new NotFoundException('Question not found');
        } else return isDeleted;
    }

    @Put(':id')
    @UseGuards(BasicAuthGuard)
    @HttpCode(204)
    async updateQuestion(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
        // реализация метода для обновления вопроса по id
        const updateQuestion = await this.commandBus.execute(new UpdateQuestionCommand(id, dto));
        if (!updateQuestion) {
            throw new NotFoundException('Question with this id not found');
        } else return updateQuestion;
    }

    @Put(':id/publish')
    @UseGuards(BasicAuthGuard)
    @HttpCode(204)
    async publishQuestion(@Param('id') id: string, @Body() dto: PublishedQuestionDto) {
        const command = new PublishQuestionCommand(id, dto);
        const publishQuestion = await this.commandBus.execute<PublishQuestionCommand | boolean>(command);
        if (!publishQuestion) {
            throw new NotFoundException('Question with this id not found');
        } else return publishQuestion;
    }
}

import { Controller, Get, Post, Delete, Put, Param, Body } from '@nestjs/common';

@Controller('sa/quiz/questions')
export class QuizQuestionsController {
    @Get()
    getAllQuestions() {
        // реализация метода для получения всех вопросов с пагинацией и фильтрацией
    }

    @Post()
    createQuestion(@Body() body: any) {
        // реализация метода для создания вопроса
    }

    @Delete(':id')
    deleteQuestion(@Param('id') id: string) {
        // реализация метода для удаления вопроса по id
    }

    @Put(':id')
    updateQuestion(@Param('id') id: string, @Body() body: any) {
        // реализация метода для обновления вопроса по id
    }

    @Put(':id/publish')
    publishQuestion(@Param('id') id: string, @Body() body: any) {
        // реализация метода для публикации/отзыва публикации вопроса по id
    }
}

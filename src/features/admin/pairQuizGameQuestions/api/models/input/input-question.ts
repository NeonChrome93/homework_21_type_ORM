import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class CreateGameQuestionDto {
    @IsString()
    body: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    correctAnswers: string[];
}

export type QuestionQueryType = {
    pageNumber: string;
    pageSize: string;
    sortBy: string;
    sortDirection: string;
    searchNameTerm: string | null;
};

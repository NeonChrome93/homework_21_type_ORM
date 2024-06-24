import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsArray, IsBoolean, IsString, Length } from 'class-validator';

export class CreateGameQuestionDto {
    @IsString()
    body: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    correctAnswers: string[];
}

export class PublishedQuestionDto {
    @IsBoolean()
    published: boolean;
}

export class UpdateQuestionDto {
    @IsString()
    @Length(10, 500)
    body: string;

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(6)
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

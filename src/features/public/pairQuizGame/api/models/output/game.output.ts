export type GameModel = {
    id: string;
    firstPlayerProgress: {
        answers: {
            questionId: string;
            answerStatus: string; // Например, 'Correct' или 'Incorrect'
            addedAt: string; // ISO 8601 дата-время
        }[];
        player: {
            id: string;
            login: string;
        };
        score: number;
    };
    secondPlayerProgress: {
        answers: {
            questionId: string;
            answerStatus: string;
            addedAt: string;
        }[];
        player: {
            id: string;
            login: string;
        };
        score: number;
    };
    questions: {
        id: string;
        body: string;
    }[];
    status: string;
    pairCreatedDate: string;
    startGameDate: string;
    finishGameDate: string;
};

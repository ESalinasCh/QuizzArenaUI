export type GradeStatusResponse = 'InProgress' | 'Completed' | 'Timeout';
export type MatchStatusResponse = 'Pending' | 'Active' | 'Expired';

export interface GradeResponse {
    id: string;
    nickname: string;
    status: GradeStatusResponse;
    score: number;
    userId: string;
    matchId: string;
    otherAttempts: AttemptResponse[];
}

export interface AttemptResponse {
    id: string;
    nickname: string;
    status: GradeStatusResponse;
    score: number;
}

export interface MatchResponse {
    id: string;
    quizId?: string;
    title: string;
    courseName: string;
    courseId?: string;
    questionCount: number;
    professorName: string;
    duration: number;
    status?: MatchStatusResponse | string;
    mode?: string;
    startedAt?: string;
    finishedAt?: string;
    attemptsAmount?: number;
    createdAt?: string;
}

export interface AttemptDetailOptionResponse {
    id: string;
    description: string;
    isCorrect: boolean;
}

export interface AttemptDetailQuestionResponse {
    questionId: string;
    content: string;
    selectedOptionIds: string[];
    isCorrect: boolean;
    options: AttemptDetailOptionResponse[];
}

export interface AttemptDetailResponse {
    id: string;
    score: number;
    status: string;
    questions: AttemptDetailQuestionResponse[];
}

export interface GradeAttemptFilters {
    status?: GradeStatusResponse;
    Nickname?: string;
    Page?: number;
    PageSize?: number;
}


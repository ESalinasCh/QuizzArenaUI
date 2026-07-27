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

export interface GradeAttemptFilters {
    status?: GradeStatusResponse;
    Nickname?: string;
    Page?: number;
    PageSize?: number;
}

export interface MatchFilters {
    code?: string;
    status?: MatchStatusResponse;
    mode?: string;
    courseId?: string;
    quizId?: string;
    Code?: string;
    Status?: string;
    Mode?: string;
    CourseId?: string;
    QuizId?: string;
}

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
    title: string;
    courseName: string;
    questionCount: number;
    professorName: string;
    duration: number;
    createdAt: string;
}

export interface GradeAttemptFilters {
    status?: GradeStatusResponse;
    Nickname?: string;
    Page?: number;
    PageSize?: number;
}

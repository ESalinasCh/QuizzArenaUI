import { Grade, Match } from "../models/exam.model";
import { GradeResponse, MatchResponse } from "./teacher-grades.contract";

export function mapGradeResponse(response: GradeResponse): Grade {
    return {
        id: response.id,
        nickname: response.nickname,
        status: response.status,
        score: response.score,
        userId: response.userId,
        matchId: response.matchId,
        otherAttempts: response.otherAttempts.map(attempt => ({
            id: attempt.id,
            nickname: attempt.nickname,
            status: attempt.status,
            score: attempt.score
        }))
    };
}

export function mapMatchResponse(response: MatchResponse): Match {
    return {
        id: response.id,
        title: response.title,
        courseName: response.courseName,
        questionCount: response.questionCount,
        professorName: response.professorName,
        duration: response.duration,
    };
}

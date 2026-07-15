import { GradeResponse, MatchResponse } from "./teacher-grades.contract";
import { mapGradeResponse, mapMatchResponse } from "./teacher-grades.mapper";

describe('teacher-exam.mapper', () => {
  describe('mapGradeResponse', () => {
    it('should map id and name', () => {
      const response: GradeResponse = {
        id: 'grade-1',
        nickname: 'John Doe',
        status: 'Completed',
        score: 85, userId:
        'user-1', matchId:
        'match-1',
        otherAttempts: []
      };
      const result = mapGradeResponse(response);
      expect(result.id).toBe('grade-1');
      expect(result.nickname).toBe('John Doe');
    });
  });
})

describe('teacher-exam.mapper', () => {
  describe('mapMatchResponse', () => {
    it('should map id and name', () => {
      const response: MatchResponse = {
        id: 'match-1',
        title: 'Match 1',
        courseName: 'Course 1',
        questionCount: 10,
        professorName: 'Prof. Smith',
        duration: 60,
        createdAt: new Date().toString()
      };
      const result = mapMatchResponse(response);
      expect(result.id).toBe('match-1');
      expect(result.title).toBe('Match 1');
    });
  });
})

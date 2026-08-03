import { AttemptDetailResponse, GradeResponse, MatchResponse } from "./teacher-grades.contract";
import { mapAttemptDetailResponse, mapGradeResponse, mapMatchResponse } from "./teacher-grades.mapper";

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

describe('teacher-grades.mapper', () => {
  describe('mapAttemptDetailResponse', () => {
    const buildResponse = (): AttemptDetailResponse => ({
      id: 'attempt-1',
      score: 50,
      status: 'failed',
      questions: [
        {
          questionId: 'question-1',
          content: 'Which are prime numbers?',
          selectedOptionIds: ['option-1', 'option-3'],
          isCorrect: true,
          options: [
            { id: 'option-1', description: 'Two', isCorrect: true },
            { id: 'option-2', description: 'Four', isCorrect: false },
            { id: 'option-3', description: 'Three', isCorrect: true },
          ],
        },
        {
          questionId: 'question-2',
          content: 'What is 2 + 2?',
          selectedOptionIds: [],
          isCorrect: false,
          options: [{ id: 'option-4', description: 'Four', isCorrect: true }],
        },
      ],
    });

    it('should map the attempt id and score', () => {
      const result = mapAttemptDetailResponse(buildResponse());

      expect(result.id).toBe('attempt-1');
      expect(result.score).toBe(50);
      expect(result.questions.length).toBe(2);
    });

    it('should number the questions in order', () => {
      const result = mapAttemptDetailResponse(buildResponse());

      expect(result.questions.map(question => question.number)).toEqual([1, 2]);
      expect(result.questions[0].id).toBe('question-1');
      expect(result.questions[0].text).toBe('Which are prime numbers?');
      expect(result.questions[0].isCorrect).toBe(true);
    });

    it('should join every selected option description', () => {
      const result = mapAttemptDetailResponse(buildResponse());

      expect(result.questions[0].selectedAnswerLabel).toBe('Two, Three');
    });

    it('should fall back to no answer when nothing was selected', () => {
      const result = mapAttemptDetailResponse(buildResponse());

      expect(result.questions[1].selectedAnswerLabel).toBe('No answer');
    });

    it('should ignore selected ids that are missing from the options', () => {
      const response = buildResponse();
      response.questions[0].selectedOptionIds = ['option-1', 'unknown-option'];

      const result = mapAttemptDetailResponse(response);

      expect(result.questions[0].selectedAnswerLabel).toBe('Two');
    });
  });
})

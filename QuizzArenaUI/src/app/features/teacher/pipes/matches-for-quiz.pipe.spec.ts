import { MatchesForQuizPipe } from './matches-for-quiz.pipe';
import { QuizResponseAsExams } from '../api/teacher-exam.contract';
import { Match } from '../models/exam.model';

describe('MatchesForQuizPipe', () => {
  let pipe: MatchesForQuizPipe;

  const mockQuiz: QuizResponseAsExams = {
    id: 'quiz-1',
    title: 'IA General',
    description: 'Desc',
    status: 'draft',
    origin: 'ManuallyCreated',
    questions: [],
  };

  const mockMatches: Match[] = [
    {
      id: 'm1',
      quizId: 'quiz-1',
      title: 'IA General 01/01',
      courseName: 'Course 1',
      questionCount: 5,
      professorName: 'Prof',
      duration: 30,
    },
    {
      id: 'm2',
      title: 'IA General 02/01',
      courseName: 'Course 2',
      questionCount: 5,
      professorName: 'Prof',
      duration: 30,
    },
    {
      id: 'm3',
      quizId: 'other-quiz',
      title: 'Math Quiz',
      courseName: 'Course 3',
      questionCount: 5,
      professorName: 'Prof',
      duration: 30,
    },
  ];

  beforeEach(() => {
    pipe = new MatchesForQuizPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array if matches is undefined', () => {
    expect(pipe.transform(mockQuiz)).toEqual([]);
    expect(pipe.transform(mockQuiz, undefined)).toEqual([]);
  });

  it('should filter matches by quizId or title prefix', () => {
    const result = pipe.transform(mockQuiz, mockMatches);
    expect(result.length).toBe(2);
    expect(result.map(m => m.id)).toEqual(['m1', 'm2']);
  });
});

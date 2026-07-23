import { ClassSourceResponse, ExamResponse, QuestionResponse } from '../api/teacher-exam.contract';
import { GradeResponse } from '../api/teacher-grades.contract';

export const TEACHER_CLASSES_RESPONSE_MOCK: ClassSourceResponse[] = [
  { id: 'aaaaaaaa-0000-0000-0000-000000000001', name: 'Desarrollo Web Full Stack' },
  { id: 'aaaaaaaa-0000-0000-0000-000000000002', name: 'React y Node.js' },
  { id: 'aaaaaaaa-0000-0000-0000-000000000003', name: 'Bases de Datos Avanzadas' },
];

export const TEACHER_QUESTIONS_RESPONSE_MOCK: QuestionResponse[] = [
  { id: 'q1', content: '¿Qué es un Bounded Context?', processingJobId: 'source-ddd-1', status: 'verified' },
  { id: 'q2', content: 'Diferencia entre Entity y Value Object', processingJobId: 'source-ddd-1', status: 'verified' },
  { id: 'q3', content: '¿Qué es un Aggregate Root?', processingJobId: 'source-ddd-1', status: 'verified' },
  { id: 'q4', content: '¿Cuál es la diferencia entre un dominio y un subdominio?', processingJobId: 'source-ddd-1', status: 'verified' },
  { id: 'q5', content: '¿Qué es un Domain Event?', processingJobId: 'source-ddd-2', status: 'verified' },
  { id: 'q6', content: '¿Para qué sirve un Repository en DDD?', processingJobId: 'source-ddd-2', status: 'verified' },
  { id: 'q7', content: '¿Qué es una arquitectura hexagonal?', processingJobId: 'source-hex-1', status: 'verified' },
  { id: 'q8', content: '¿Cuál es la diferencia entre un puerto y un adaptador?', processingJobId: 'source-hex-1', status: 'verified' },
];

export const TEACHER_EXAMS_MOCK: ExamResponse[] = [
  {
    id: 'b314f532-51dc-43d3-9644-e898b3606e4b',
    title: 'Linked List Basics Quiz',
    description: 'Fundamentals of linked list concepts',
    status: 'draft',
    questionIds: ['30000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002'],
    createdAt: '2026-06-18T11:00:00.000Z',
  },
  {
    id: '95600f94-026d-400d-a0a9-2ad167980350',
    title: 'Linked List Fundamentals Quiz',
    description: 'Fundamentals of linked lists',
    status: 'draft',
    questionIds: ['30000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000004'],
    createdAt: '2026-06-18T11:00:00.000Z',
  },
  {
    id: 'exam-pub-1',
    title: 'DDD Week 1 Exam',
    description: 'First week assessment',
    status: 'published',
    questionIds: ['30000000-0000-0000-0000-000000000001'],
    createdAt: '2026-06-15T09:00:00.000Z',
  },
];

export function buildCreateExamResponseMock(
  title: string,
  description: string,
  questionIds: string[],
  status: 'draft' | 'published' = 'draft',
): ExamResponse {
  return {
    id: `exam-${Date.now()}`,
    title,
    description,
    status,
    questionIds,
    createdAt: new Date().toISOString(),
  };
}

export const TEACHER_GRADES_MOCK: GradeResponse[] = [
  {
    id: "ca200000-0000-0000-0000-000000000002",
    nickname: "max_attempt2",
    status: "Completed",
    score: 75.00,
    userId: "37976960-c868-45d4-b3c2-4967cb46f4b0",
    matchId: "b2222222-2222-2222-2222-222222222222",
    otherAttempts: [
      {
        id: "ca200000-0000-0000-0000-000000000001",
        nickname: "max_attempt1",
        status: "Completed",
        score: 60.00
      },
      {
        id: "ca200000-0000-0000-0000-000000000003",
        nickname: "user_attempt_01",
        status: "Completed",
        score: 50.00
      }
    ]
  },
  {
    id: "ca200000-0000-0000-0000-000000000005",
    nickname: "user_attempt_03",
    status: "Timeout",
    score: 60.00,
    userId: "33333333-3333-3333-3333-333333333333",
    matchId: "b2222222-2222-2222-2222-222222222222",
    otherAttempts: [
    ]
  },
  {
    id: "ca200000-0000-0000-0000-000000000005",
    nickname: "user_attempt_03",
    status: "InProgress",
    score: 60.00,
    userId: "33333333-3333-3333-3333-333333333333",
    matchId: "b2222222-2222-2222-2222-222222222222",
    otherAttempts: [
      {
        id: "ca200000-0000-0000-0000-000000000004",
        nickname: "user_attempt_02",
        status: "Completed",
        score: 50.00
      }
    ]
  }
]

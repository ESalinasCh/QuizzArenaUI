import { ClassSourceResponse, ExamResponse, QuestionResponse } from '../api/teacher-exam.contract';

export const TEACHER_CLASSES_RESPONSE_MOCK: ClassSourceResponse[] = [
  { id: 'aaaaaaaa-0000-0000-0000-000000000001', name: 'DDD - Semana 1' },
  { id: 'source-ddd-2', name: 'DDD - Semana 2' },
  { id: 'source-hex-1', name: 'Hexagonal - Semana 1' },
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
    id: 'exam-draft-1',
    title: 'DDD Fundamentals',
    description: 'Core DDD concepts quiz',
    status: 'draft',
    questionIds: ['q1', 'q2', 'q3'],
    createdAt: '2026-06-20T10:00:00.000Z',
  },
  {
    id: 'exam-draft-2',
    title: 'Hexagonal Architecture',
    description: 'Ports and adapters concepts',
    status: 'draft',
    questionIds: ['q7', 'q8'],
    createdAt: '2026-06-22T14:30:00.000Z',
  },
  {
    id: 'exam-pub-1',
    title: 'DDD Week 1 Exam',
    description: 'First week assessment',
    status: 'published',
    questionIds: ['q1', 'q2', 'q3', 'q4'],
    createdAt: '2026-06-15T09:00:00.000Z',
  },
  {
    id: 'exam-pub-2',
    title: 'Domain Events & Repositories',
    description: 'Second week assessment',
    status: 'published',
    questionIds: ['q5', 'q6'],
    createdAt: '2026-06-18T11:00:00.000Z',
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

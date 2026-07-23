import { ClassSource, Exam, Question } from '../models/exam.model';
import { ClassSourceResponse, CreateQuizResponseBody, ExamResponse, QuestionResponse } from './teacher-exam.contract';

export function mapClassSourceResponse(response: ClassSourceResponse): ClassSource {
  return { id: response.id, name: response.name };
}

export function mapQuestionResponse(response: QuestionResponse): Question {
  return {
    id: response.id,
    text: response.content,
    options: [],
    sourceId: response.processingJobId,
    sourceName: '',
  };
}

export function mapExamResponse(response: any): Exam {
  return {
    id: response.id,
    title: response.title,
    description: response.description,
    status: response.status === 'published' ? 'published' : 'draft',
    questionIds: response.questionIds || (response.questions ? response.questions.map((q: any) => q.questionId || q.id || q) : []) || [],
    createdAt: response.createdAt,
  };
}

export function mapCreateQuizResponse(response: CreateQuizResponseBody): Exam {
  return {
    id: response.id,
    title: response.title,
    description: response.description,
    status: response.status === 'published' ? 'published' : 'draft',
    questionIds: response.questions.map(q => q.questionId),
    createdAt: new Date().toISOString(),
  };
}

import { ClassSource, Exam, Question } from '../models/exam.model';
import { ClassSourceResponse, CreateQuizResponseBody, ExamResponse, QuestionResponse } from './teacher-exam.contract';

export function mapClassSourceResponse({ id, name }: ClassSourceResponse): ClassSource {
  return { id, name };
}

export function mapQuestionResponse({ id, content, processingJobId }: QuestionResponse): Question {
  return {
    id,
    text: content,
    options: [],
    sourceId: processingJobId,
    sourceName: '',
  };
}

export function mapExamResponse({ id, title, description, status, questionIds, questions, createdAt }: ExamResponse): Exam {
  return {
    id,
    title,
    description,
    status: status === 'published' ? 'published' : 'draft',
    questionIds: questionIds || (questions ? questions.map(q => q.questionId || q.id || '') : []) || [],
    createdAt,
  };
}

export function mapCreateQuizResponse({ id, title, description, status, questions }: CreateQuizResponseBody): Exam {
  return {
    id,
    title,
    description,
    status: status === 'published' ? 'published' : 'draft',
    questionIds: questions.map(q => q.questionId),
    createdAt: new Date().toISOString(),
  };
}

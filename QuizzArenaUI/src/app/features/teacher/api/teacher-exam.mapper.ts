import { ClassSource, Exam, Question } from '../models/exam.model';
import { ClassSourceResponse, ExamResponse, QuestionResponse } from './teacher-exam.contract';

export function mapClassSourceResponse(response: ClassSourceResponse): ClassSource {
  return { id: response.id, name: response.name };
}

export function mapQuestionResponse(response: QuestionResponse): Question {
  return {
    id: response.id,
    text: response.text,
    options: response.options,
    sourceId: response.sourceId,
    sourceName: response.sourceName,
  };
}

export function mapExamResponse(response: ExamResponse): Exam {
  return {
    id: response.id,
    title: response.title,
    description: response.description,
    status: response.status === 'published' ? 'published' : 'draft',
    questionIds: response.questionIds,
    createdAt: response.createdAt,
  };
}

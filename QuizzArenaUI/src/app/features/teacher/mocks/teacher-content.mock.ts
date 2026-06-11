import {
  CourseResponse,
  TeacherContentResponse,
  TeacherQuizStatsResponse,
  UploadContentResponse,
} from '../api/teacher-content.contract';

export const TEACHER_QUIZ_STATS_RESPONSE_MOCK: TeacherQuizStatsResponse = {
  quizCount: 8,
  publishedCount: 8,
};

export const TEACHER_CONTENTS_RESPONSE_MOCK: TeacherContentResponse[] = [
  {
    id: '1',
    title: 'Clase Project I - Semana 1',
    courseId: 'course-project-1',
    status: 'processed',
    questionCount: 12,
    processingMinutesRemaining: null,
    createdAt: '2026-06-02',
  },
  {
    id: '2',
    title: 'Clase Project I - Semana 2',
    courseId: 'course-project-1',
    status: 'processed',
    questionCount: 10,
    processingMinutesRemaining: null,
    createdAt: '2026-06-05',
  },
  {
    id: '3',
    title: 'Clase Hexagonal - Semana 3',
    courseId: 'course-hexagonal',
    status: 'processing',
    questionCount: null,
    processingMinutesRemaining: 5,
    createdAt: '2026-06-10',
  },
  {
    id: '4',
    title: 'Clase Hexagonal - Semana 2',
    courseId: 'course-hexagonal',
    status: 'processing',
    questionCount: null,
    processingMinutesRemaining: 1,
    createdAt: '2026-06-11',
  },
];

export const TEACHER_COURSES_RESPONSE_MOCK: CourseResponse[] = [
  { id: 'course-project-1', name: 'Project I' },
  { id: 'course-hexagonal', name: 'Arquitectura Hexagonal' },
  { id: 'course-ddd', name: 'Domain-Driven Design' },
];

export function buildUploadContentResponseMock(
  className: string,
  courseId: string,
): UploadContentResponse {
  return {
    id: `content-${Date.now()}`,
    title: className,
    courseId,
    status: 'processing',
    createdAt: new Date().toISOString(),
  };
}

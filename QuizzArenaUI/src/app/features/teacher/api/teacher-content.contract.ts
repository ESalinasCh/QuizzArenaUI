export type ContentStatusResponse = 'processed' | 'processing';

export interface TeacherContentResponse {
  id: string;
  title: string;
  courseId: string;
  status: ContentStatusResponse;
  questionCount: number | null;
  processingMinutesRemaining: number | null;
  createdAt: string;
}

export interface TeacherQuizStatsResponse {
  quizCount: number;
  publishedCount: number;
}

export interface CourseResponse {
  id: string;
  name: string;
}

export interface UploadContentResponse {
  id: string;
  title: string;
  courseId: string;
  status: ContentStatusResponse;
  createdAt: string;
}

export interface UploadContentResponse {
  id: string;
  title: string;
  courseId: string;
  status: ContentStatusResponse;
  createdAt: string;
}

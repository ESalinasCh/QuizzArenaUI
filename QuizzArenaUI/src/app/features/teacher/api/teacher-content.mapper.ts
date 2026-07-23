import {
  CourseResponse,
  TeacherContentResponse,
  TeacherQuizStatsResponse,
} from './teacher-content.contract';
import { RecentContent, TeacherDashboard } from '../models/teacher-dashboard.model';
import { Subject } from '../models/content-upload.model';

export function mapTeacherDashboardResponse(
  { quizCount, publishedCount }: TeacherQuizStatsResponse,
  contents: TeacherContentResponse[],
): TeacherDashboard {
  return {
    quizCount,
    publishedCount,
    recentContent: contents.map(mapTeacherContentResponse),
  };
}

export function mapTeacherContentResponse(
  { id, title, status, questionCount, processingMinutesRemaining }: TeacherContentResponse,
): RecentContent {
  return {
    id,
    title,
    status: status === 'processed' ? 'processed' : 'in-progress',
    info:
      status === 'processed'
        ? `${questionCount ?? 0} preg.`
        : `${processingMinutesRemaining ?? 0} min`,
  };
}

export function mapCourseResponse({ id, name }: CourseResponse): Subject {
  return { id, name };
}

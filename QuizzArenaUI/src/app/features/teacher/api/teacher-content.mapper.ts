import {
  CourseResponse,
  TeacherContentResponse,
  TeacherQuizStatsResponse,
} from './teacher-content.contract';
import { RecentContent, TeacherDashboard } from '../models/teacher-dashboard.model';
import { Course } from '../models/content-upload.model';

export function mapTeacherDashboardResponse(
  stats: TeacherQuizStatsResponse,
  contents: TeacherContentResponse[],
): TeacherDashboard {
  return {
    quizCount: stats.quizCount,
    publishedCount: stats.publishedCount,
    recentContent: contents.map(mapTeacherContentResponse),
  };
}

export function mapTeacherContentResponse(response: TeacherContentResponse): RecentContent {
  return {
    id: response.id,
    title: response.title,
    status: response.status === 'processed' ? 'processed' : 'in-progress',
    info:
      response.status === 'processed'
        ? `${response.questionCount ?? 0} preg.`
        : `${response.processingMinutesRemaining ?? 0} min`,
  };
}

export function mapCourseResponse(response: CourseResponse): Course {
  return {
    id: response.id,
    name: response.name,
  };
}

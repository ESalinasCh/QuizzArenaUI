export type ContentStatus = 'processed' | 'in-progress';

export interface RecentContent {
  id: string;
  title: string;
  status: ContentStatus;
  info: string;
}

export interface TeacherDashboard {
  quizCount: number;
  publishedCount: number;
  recentContent: RecentContent[];
}

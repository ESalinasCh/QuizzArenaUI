export interface Course {
  id: string;
  name: string;
}

export interface ReviewSettings {
  questionCount: number;
  showCorrectAnswers: boolean;
  shuffleQuestions: boolean;
}

export interface ContentUploadRequest {
  file: File;
  className: string;
  subjectId: string;
  review: { enabled: false } | { enabled: true; settings: ReviewSettings };
}

export interface Subject {
  id: string;
  name: string;
}

export interface ContentUploadRequest {
  file: File;
  className: string;
  subjectId: string;
}

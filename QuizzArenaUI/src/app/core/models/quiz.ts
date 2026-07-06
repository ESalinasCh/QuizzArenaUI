export type QuizStatus = 'Draft' | 'Verified' | 'Disapproved';
export type QuizType = 'MultipleChoice';

export interface Quiz {
    content: string,
    justification: string,
    status: QuizStatus,
    type: QuizType,
    processingJobId: string,
    id: string,
    createdAt: Date,
    updatedAt: Date,
}

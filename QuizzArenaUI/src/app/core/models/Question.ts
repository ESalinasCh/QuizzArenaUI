export type QuestionStatus = 'Draft' | 'Verified' | 'Disapproved';
export type QuestionType = 'MultipleChoice' | 'SingleChoice';

export interface Question {
    content: string,
    justification: string,
    status: QuestionStatus,
    type: QuestionType,
    processingJobId: string,
    id: string,
    createdAt: Date,
    updatedAt: Date,
}

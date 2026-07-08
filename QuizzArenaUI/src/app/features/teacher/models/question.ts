export type QuestionStatus = 'Draft' | 'Verified' | 'Disapproved';
export type QuestionType = 'MultipleChoice' | 'SingleChoice';

export class Question {
    content: string;
    justification: string;
    status: QuestionStatus;
    type: QuestionType;
    processingJobId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;

    constructor() {
        this.content = '';
        this.justification = '';
        this.status = 'Draft';
        this.type = 'SingleChoice';
        this.processingJobId = '';
        this.id = '';
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

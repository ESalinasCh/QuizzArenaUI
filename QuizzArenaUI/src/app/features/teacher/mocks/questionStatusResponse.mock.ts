import { QuestionStatus } from "../models/question";

export interface StatusQuestionOptions {
    key: QuestionStatus,
    label: string
}

export const QUESTION_STATUS_RESPONSE: StatusQuestionOptions[] = [
    { key: 'Draft', label: 'Draft' },
    { key: 'Disapproved', label: 'Disapproved' },
    { key: 'Verified', label: 'Verified' },
];
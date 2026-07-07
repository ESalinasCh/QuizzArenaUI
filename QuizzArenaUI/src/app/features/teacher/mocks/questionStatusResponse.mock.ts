import { QuestionStatus } from "../../../core/models/Question";

export interface StatusQuestionOptions {
    key: QuestionStatus,
    label: string
}

export const QUESTION_STATUS_RESPONSE: StatusQuestionOptions[] = [
    { key: 'Draft', label: 'MultipleChoice' },
    { key: 'Disapproved', label: 'Disapproved' },
    { key: 'Verified', label: 'Verified' },
];
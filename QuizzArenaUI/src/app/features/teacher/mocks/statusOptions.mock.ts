import { QuizStatus } from "../../../core/models/quiz";

export interface StatusOptionMock {
    key: QuizStatus,
    label: string
}

export const STATUS_OPTIONS_MOCK: StatusOptionMock[] = [
    { key: 'Draft', label: 'Draft' },
    { key: 'Disapproved', label: 'Disapproved' },
    { key: 'Verified', label: 'Verified' },
];
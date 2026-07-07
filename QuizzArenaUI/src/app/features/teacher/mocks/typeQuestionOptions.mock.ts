import { QuestionType } from "../../../core/models/Question";

export interface TypeQuestionOptions {
    key: QuestionType,
    label: string
}

export const TYPE_OPTIONS_MOCK: TypeQuestionOptions[] = [
    { key: 'MultipleChoice', label: 'Multiple Choice' },
    { key: 'SingleChoice', label: 'Single Choice' },
];
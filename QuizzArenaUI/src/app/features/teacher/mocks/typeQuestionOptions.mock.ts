import { QuizType } from "../../../core/models/quiz";

export interface TypeQuestionOptions {
    key: QuizType,
    label: string
}

export const TYPE_OPTIONS_MOCK: TypeQuestionOptions[] = [
    { key: 'MultipleChoice', label: 'MultipleChoice' },
];
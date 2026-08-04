interface BaseForm {
    courseId: string;
    durationMinutes: string;
    questionsAmount: string;
    maxRetries: string;
    enabledFrom: string;
    enabledUntil: string;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
}

export interface PublishMatchForm extends BaseForm {
}

export interface EditMatchForm extends BaseForm {
}

export type PublishMode = 'publish' | 'edit';

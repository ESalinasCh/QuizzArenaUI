interface BaseForm {
    title: string;
    courseId: string;
    durationMinutes: string;
    questionsAmount: string;
    maxRetries: string;
    enabledFrom: string;
    enabledUntil: string;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
}

export type PublishMatchForm = BaseForm;
export type EditMatchForm = BaseForm;

export type PublishMode = 'publish' | 'edit';

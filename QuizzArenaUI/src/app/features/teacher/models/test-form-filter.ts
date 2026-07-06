import { QuizStatus, QuizType } from "../../../core/models/quiz";

export class TestFormFilter {
    status: Record<QuizStatus, boolean>;
    types: Record<QuizType, boolean>;

    constructor() {
        this.status = {
            Disapproved: false,
            Draft: false,
            Verified: false,
        };
        this.types = {
            MultipleChoice: false,
        };
    }
}
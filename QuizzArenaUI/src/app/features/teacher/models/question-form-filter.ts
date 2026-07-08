import { QuestionStatus, QuestionType } from "./question";

export class QuestionFilter {
    status: Record<QuestionStatus, boolean>;
    types: Record<QuestionType, boolean>;

    constructor() {
        this.status = {
            Disapproved: false,
            Draft: false,
            Verified: false,
        };
        this.types = {
            MultipleChoice: false,
            SingleChoice: false,
        };
    }
}
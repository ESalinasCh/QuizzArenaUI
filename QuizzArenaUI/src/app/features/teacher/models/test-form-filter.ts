import { QuestionStatus, QuestionType } from "../../../core/models/Question";

export class TestFormFilter {
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
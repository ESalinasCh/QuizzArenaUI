import { ExamStatus } from "./exam.model";

export class ExamFormFilter {
    startDate: string;
    endDate: string;
    states: Record<ExamStatus, boolean>;

    constructor() {
        this.startDate = '';
        this.endDate = '';
        this.states = {
            draft: false,
            published: false,
        };
    }
}
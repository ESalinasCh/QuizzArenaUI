export class Option {
    id?: string;
    optionId?: string;
    description: string;
    isCorrect: boolean;
    position: number;
    questionId: string;

    constructor(){
        this.description = '';
        this.isCorrect = false;
        this.position = 0;
        this.questionId = '';
    }
}


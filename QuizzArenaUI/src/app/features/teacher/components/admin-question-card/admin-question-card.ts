import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { Button } from '../../../../shared/atoms/button/button';
import { TextSpan } from '../../../../shared/atoms/text-span/text-span';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { ClickableDropbox } from '../../../../shared/organisms/clickable-dropbox/clickable-dropbox';
import { ItemContainer } from '../../../../shared/atoms/item-container/item-container';
import { QuestionEditModal } from '../question-add-edit-modal/question-add-edit-modal';
import { QuestionInfoModal } from '../question-info-modal/question-info-modal';
import { QuestionDeleteModal } from '../question-delete-modal/question-delete-modal';
import { Question } from '../../models/question';
import { ModalService } from '../../../../core/services/modal.service';


@Component({
    selector: 'qz-admin-question-card',
    templateUrl: './admin-question-card.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(window:resize)': 'onResize()',
    },
    imports: [Button, TextSpan, Icon, ClickableDropbox, ItemContainer],
})
export class AdminQuestionCard {
    readonly #modalService = inject(ModalService);
    question = input.required<Question>();
    newQuestion = output<Question>()
    deleteQuestionById = output<string>();

    readonly #mobileBreakpoint = 768;
    width = signal(window.innerWidth);
    isMobile = () => this.width() < this.#mobileBreakpoint;
    isDropdownOpened = signal(false);

    openInfoModal() {
        this.#modalService.open(QuestionInfoModal, { question: this.question() });
    }

    openEditModal() {
        const ref = this.#modalService.open<QuestionEditModal, Question>(QuestionEditModal, { question: this.question() });
        ref.afterClosed.then((question) => {
            if (question) {
                this.handleNewQuestion(question);
            }
        });
    }

    openDeleteModal() {
        const ref = this.#modalService.open<QuestionDeleteModal, string>(QuestionDeleteModal, { question: this.question() });
        ref.afterClosed.then((id) => {
            if (id) {
                this.handleDeleteQuestion(id);
            }
        });
    }

    handleToggleDropdown(value: boolean) { this.isDropdownOpened.set(value); }

    onResize() { this.width.set(window.innerWidth); }

    handleNewQuestion(question: Question) {
        this.newQuestion.emit(question);
    }

    handleDeleteQuestion(id: string) {
        this.deleteQuestionById.emit(id);
    }

}

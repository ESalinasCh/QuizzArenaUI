import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Button } from '../../../../shared/atoms/button/button';
import { TextSpan } from '../../../../shared/atoms/text-span/text-span';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { ClickableDropbox } from '../../../../shared/organisms/clickable-dropbox/clickable-dropbox';
import { ItemContainer } from '../../../../shared/atoms/item-container/item-container';
import { QuestionEditModal } from '../question-add-edit-modal/question-add-edit-modal';
import { QuestionInfoModal } from '../question-info-modal/question-info-modal';
import { QuestionDeleteModal } from '../question-delete-modal/question-delete-modal';
import { Question } from '../../models/question';

@Component({
    selector: 'qz-admin-question-card',
    templateUrl: './admin-question-card.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(window:resize)': 'onResize()',
    },
    imports: [Button, TextSpan, Icon, ClickableDropbox, ItemContainer, QuestionInfoModal, QuestionEditModal, QuestionDeleteModal],
})
export class AdminQuestionCard {
    question = input.required<Question>();
    newQuestion = output<Question>()
    deleteQuestionById = output<string>();

    private readonly mobileBreakpoint = 768;
    width = signal(window.innerWidth);
    isMobile = () => this.width() < this.mobileBreakpoint;
    isDropdownOpened = signal(false);

    isInfoModalOpened = signal<boolean>(false);
    isEditModalOpened = signal<boolean>(false);
    isDeleteModalOpened = signal<boolean>(false);

    toggleInfoModal(flag: boolean) { this.isInfoModalOpened.set(flag); }
    toggleEditModal(flag: boolean) { this.isEditModalOpened.set(flag); }
    toggleDeleteModal(flag: boolean) { this.isDeleteModalOpened.set(flag); }

    handleToggleDropdown(value: boolean) { this.isDropdownOpened.set(value); }

    onResize() { this.width.set(window.innerWidth); }

    handleNewQuestion(question: Question) {
        this.newQuestion.emit(question);
    }

    handleDeleteQuestion(id: string) {
        this.deleteQuestionById.emit(id);
    }

}

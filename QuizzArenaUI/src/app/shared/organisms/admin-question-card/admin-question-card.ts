import { ChangeDetectionStrategy, Component, model, signal } from '@angular/core';
import { Button } from "../../atoms/button/button";
import { TextSpan } from "../../atoms/text-span/text-span";
import { Icon } from "../../atoms/icon/icon";
import { ItemContainer } from "../../atoms/item-container/item-container";
import { ClickableDropbox } from '../clickable-dropbox/clickable-dropbox';
import { QuestionInfoModal } from '../../../features/teacher/components/question-info-modal/question-info-modal';
import { QuestionEditModal } from "../../../features/teacher/components/question-edit-modal/question-edit-modal";
import { QuestionDeleteModal } from "../../../features/teacher/components/question-delete-modal/question-delete-modal";
import { Quiz } from '../../../core/models/quiz';

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
    quiz = model.required<Quiz>();

    private readonly mobileBreakpoint = 768;
    width = signal(window.innerWidth);
    isMobile = () => this.width() < this.mobileBreakpoint;
    isDropdownOpened = signal(false);

    isInfoModalOpened = model<boolean>(false);
    isEditModalOpened = model<boolean>(false);
    isDeleteModalOpened = model<boolean>(false);

    openInfoModal() { this.isInfoModalOpened.set(true); }
    openEditModal() { this.isEditModalOpened.set(true); }
    openDeleteModal() { this.isDeleteModalOpened.set(true); }

    toogleDropdown() { this.isDropdownOpened.update(value => !value); }

    onResize() { this.width.set(window.innerWidth); }

}

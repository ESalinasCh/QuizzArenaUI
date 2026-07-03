import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Button } from "../../atoms/button/button";
import { Question } from '../../../features/teacher/models/exam.model';
import { TextSpan } from "../../atoms/text-span/text-span";
import { Icon } from "../../atoms/icon/icon";
import { ItemContainer } from "../../atoms/item-container/item-container";
import { ClickableDropbox } from '../clickable-dropbox/clickable-dropbox';
import { QuestionInfoModal } from '../../../features/teacher/components/question-info-modal/question-info-modal';
import { QuestionEditModal } from "../../../features/teacher/components/question-edit-modal/question-edit-modal";
import { QuestionDeleteModal } from "../../../features/teacher/components/question-delete-modal/question-delete-modal";

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
    question = input<Question>({
        id: '1',
        options: ['sxsssxxsxaxa', 'sacsxsxsa'],
        sourceId: '11',
        sourceName: 'cascas',
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint ea soluta, sit, magni incidunt, ex cumque harum quisquam quod atque earum! Qui magnam dolorem soluta facilis hic eius iure voluptates?cas?'
    });

    private readonly mobileBreakpoint = 768;
    width = signal(window.innerWidth);
    isMobile = () => this.width() < this.mobileBreakpoint;
    isDropdownOpened = signal(false);

    isInfoModalOpened = signal(false);
    isEditModalOpened = signal(false);
    isDeleteModalOpened = signal(false);

    toogleShowInfoModalOpened() { this.isInfoModalOpened.update(value => !value); }
    toogleShowEditModalOpened() { this.isEditModalOpened.update(value => !value); }
    toogleShowDeleteModalOpened() { this.isDeleteModalOpened.update(value => !value); }

    toogleDropdown() { this.isDropdownOpened.update(value => !value); }

    onResize() { this.width.set(window.innerWidth); }

}

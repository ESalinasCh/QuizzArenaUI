import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Button } from "../../atoms/button/button";
import { Question } from '../../../features/teacher/models/exam.model';
import { TextSpan } from "../../atoms/text-span/text-span";
import { Icon } from "../../atoms/icon/icon";
import { ItemContainer } from "../../atoms/item-container/item-container";
import { ClickableDropbox } from '../clickable-dropbox/clickable-dropbox';

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
    question = input<Question>({
        id: '1',
        options: ['sc', 'sacsa'],
        sourceId: '11',
        sourceName: 'cascas',
        text: '¿ascascasas  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint ea soluta, sit, magni incidunt, ex cumque harum quisquam quod atque earum! Qui magnam dolorem soluta facilis hic eius iure voluptates?cas?'
    });

    private readonly mobileBreakpoint = 768;
    width = signal(window.innerWidth);
    isMobile = () => this.width() < this.mobileBreakpoint;
    isDropdownOpened = signal(false);
    
    toogleDropdown() {
        this.isDropdownOpened.update(value => !value);
    }

    onResize() {
        this.width.set(window.innerWidth);
    }

}

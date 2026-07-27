import { Component, model, input, output } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { LinkText } from "../../atoms/link-text/link-text";
import { TextSpan } from "../../atoms/text-span/text-span";

export interface InputTextClearOption {
    isActivated: boolean;
    text?: string;
}

@Component({
    selector: 'qz-textarea-input',
    templateUrl: './textarea-input.html',
    imports: [LinkText, TextSpan],
})
export class TextareaInput implements FormValueControl<string> {
    value = model('');

    label = input('');
    for = input('');
    placeholder = input('');

    errorMessage = input('');

    clearOptionListener = output<void>();
    clearOption = input<InputTextClearOption>({ isActivated: false, text: 'Clear' });

    disabled = model(false);
    touched = model(false);
    dirty = model(false);
    invalid = model(false);
    required = model(false);

    handleClearClick() {
        this.clearOptionListener.emit();
    }
}

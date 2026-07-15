import { Component, model, input, output } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { LinkText } from "../../atoms/link-text/link-text";

export interface InputTextClearOption {
    isActivated: boolean;
    text?: string;
}

@Component({
    selector: 'qz-text-input',
    templateUrl: './text-input.html',
    imports: [LinkText],
})
export class TextInput implements FormValueControl<string> {
    value = model('');

    label = input('');
    for = input('');
    placeholder = input('');
    type = input('text');

    errorMessage = input('');

    clearOptionListener = output<void>();
    clearOption = input<InputTextClearOption>({ isActivated: false, text: 'Clear' });

    disabled = model(false);
    touched = model(false);
    invalid = model(false);
    required = model(false);

    handleClearClick() {
        this.clearOptionListener.emit();
    }
}

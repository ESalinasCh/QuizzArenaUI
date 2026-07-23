import { Component, model, input, output } from '@angular/core';
import { FormValueControl, FormField } from '@angular/forms/signals';
import { LinkText } from "../../atoms/link-text/link-text";

export interface InputTextClearOption {
    isActivated: boolean;
    text?: string;
}

type InputType = 'text' | 'number' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'date' | 'datetime-local';

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
    type = input<InputType>('text');

    errorMessage = input('');

    labeli18 = input<string>('');
    errori18 = input<string>('');

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

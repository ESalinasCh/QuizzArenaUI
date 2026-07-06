import { Component, model, input } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

export interface InputTextClearOption {
    isActivated: boolean;
    text?: string;
}

@Component({
    selector: 'qz-select-input',
    templateUrl: './select-input.html',
    imports: [],
})
export class SelectInput implements FormValueControl<string> {
    value = model('');

    label = input('');
    for = input('');
    placeholder = input('');

    errorMessage = input('');

    disabled = model(false);
    touched = model(false);
    invalid = model(false);
    required = model(false);

}

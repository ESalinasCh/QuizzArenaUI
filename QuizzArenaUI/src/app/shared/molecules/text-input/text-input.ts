import { Component, model, input } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    selector: 'qz-text-input',
    templateUrl: './text-input.html',
})
export class TextInput implements FormValueControl<string> {
    value = model('');

    label = input('');
    for = input('');
    placeholder = input('');
    type = input('text');
    errorMessage = input('');

    disabled = model(false);
    touched = model(false);
    invalid = model(false);
    required = model(false);
}

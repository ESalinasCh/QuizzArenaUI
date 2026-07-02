import { Component, model, input } from '@angular/core';
import { FormCheckboxControl } from '@angular/forms/signals';

@Component({
    selector: 'qz-checkbox-input',
    templateUrl: './checkbox-input.html',
})
export class CheckboxInputComponent implements FormCheckboxControl {
    checked = model(false);

    label = input('');
    for = input('');
    errorMessage = input('');

    disabled = model(false);
    touched = model(false);
    invalid = model(false);
    required = model(false);
}

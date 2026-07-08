import { InputSignal, OutputEmitterRef } from "@angular/core";

export interface ModalMethods {
    closeModalEvent: OutputEmitterRef<void>;
    isModalOpened: InputSignal<boolean>;
    closeModal(): void;
}

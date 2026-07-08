import { ComponentRef } from "@angular/core";

export class ModalRef<T = unknown, R = unknown> {
    readonly #componentRef: ComponentRef<T>;
    #resolveClose!: (value: R | undefined) => void;
    afterClosed = new Promise<R | undefined>((resolve) => {
        this.#resolveClose = resolve;
    });

    constructor(componentRef: ComponentRef<T>) {
        this.#componentRef = componentRef;
    }

    get instance(): T {
        return this.#componentRef.instance;
    }

    close(result?: R): void {
        this.#resolveClose(result);
        this.#componentRef.destroy();
    }
}

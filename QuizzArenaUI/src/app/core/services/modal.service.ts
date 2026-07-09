import { ApplicationRef, createComponent, EnvironmentInjector, Service, Type, ComponentRef, Injector, EmbeddedViewRef, inject } from '@angular/core';

export class ModalRef<T = unknown, R = unknown> {
  readonly #componentRef: ComponentRef<T>;
  readonly instance: T;
  #resolveClose!: (value: R | undefined) => void;
  afterClosed = new Promise<R | undefined>((resolve) => {
    this.#resolveClose = resolve;
  });

  constructor(componentRef: ComponentRef<T>) {
    this.#componentRef = componentRef;
    this.instance = componentRef.instance;
  }

  close(result?: R): void {
    this.#resolveClose(result);
    this.#componentRef.destroy();
  }
}

@Service()
export class ModalService {
  readonly #appRef = inject(ApplicationRef);
  readonly #injector = inject(EnvironmentInjector);

  open<T, R = unknown>(component: Type<T>, inputs: Record<string, unknown> = {}): ModalRef<T, R> {
    const modalRefContainer = { current: null as ModalRef<T, R> | null };

    const modalRefInjector = Injector.create({
      providers: [
        {
          provide: ModalRef,
          useFactory: () => modalRefContainer.current,
        },
      ],
      parent: this.#injector,
    });

    const componentRef = createComponent(component, {
      environmentInjector: this.#injector,
      elementInjector: modalRefInjector,
    });

    const modalRef = new ModalRef<T, R>(componentRef);
    modalRefContainer.current = modalRef;

    componentRef.setInput('closeModal', (result?: R) => modalRef.close(result));

    Object.keys(inputs).forEach(key => {
      componentRef.setInput(key, inputs[key]);
    });

    this.#appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<unknown>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    componentRef.onDestroy(() => {
      this.#appRef.detachView(componentRef.hostView);
      domElem.remove();
    });

    return modalRef;
  }
}



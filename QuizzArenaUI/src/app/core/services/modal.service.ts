import { ApplicationRef, createComponent, EnvironmentInjector, Service, Type, ComponentRef, Injector, EmbeddedViewRef, inject, TemplateRef } from '@angular/core';
import { ModalTemplateComponent } from '../../shared/organisms/modal-template/modal-template';

export interface ModalOptions {
  title?: string;
  width?: string;
  maxWidth?: string;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  showFooter?: boolean;
}

export class ModalRef<T = unknown, R = unknown> {
  #shellRef!: ComponentRef<ModalTemplateComponent>;
  instance!: T | null;
  #resolveClose!: (value: R | undefined) => void;
  readonly afterClosed = new Promise<R | undefined>((resolve) => {
    this.#resolveClose = resolve;
  });

  _initialize(shellRef: ComponentRef<ModalTemplateComponent>, componentRef: ComponentRef<T> | null): void {
    this.#shellRef = shellRef;
    this.instance = componentRef ? componentRef.instance : null;
  }

  close(result?: R): void {
    this.#resolveClose(result);
    this.#shellRef.destroy();
  }
}

@Service()
export class ModalService {
  readonly #appRef = inject(ApplicationRef);
  readonly #injector = inject(EnvironmentInjector);

  open<T, R = unknown>(
    content: Type<T> | TemplateRef<unknown>,
    inputs: Record<string, unknown> = {},
    options: ModalOptions = {}
  ): ModalRef<T, R> {
    const modalRef = new ModalRef<T, R>();

    const modalRefInjector = Injector.create({
      providers: [
        {
          provide: ModalRef,
          useValue: modalRef,
        },
      ],
      parent: this.#injector,
    });

    const shellRef = createComponent(ModalTemplateComponent, {
      environmentInjector: this.#injector,
      elementInjector: modalRefInjector,
    });

    (Object.keys(options) as (keyof ModalOptions)[]).forEach(key => {
      const value = options[key];
      if (value !== undefined) {
        shellRef.setInput(key, value);
      }
    });

    this.#appRef.attachView(shellRef.hostView);

    const domElem = (shellRef.hostView as EmbeddedViewRef<unknown>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    shellRef.changeDetectorRef.detectChanges();

    const viewContainerRef = shellRef.instance.modalContentRef();
    if (!viewContainerRef) {
      throw new Error('modalContentRef is not resolved');
    }

    let componentRef: ComponentRef<T> | null = null;

    if (content instanceof TemplateRef) {
      viewContainerRef.createEmbeddedView(content, {
        $implicit: inputs,
      });
    } else {
      componentRef = viewContainerRef.createComponent(content, {
        environmentInjector: this.#injector,
        injector: modalRefInjector,
      });
      Object.keys(inputs).forEach(key => {
        componentRef!.setInput(key, inputs[key]);
      });
    }

    modalRef._initialize(shellRef, componentRef);

    const subscription = shellRef.instance.closedModalEvent.subscribe(() => {
      modalRef.close();
    });

    shellRef.onDestroy(() => {
      subscription.unsubscribe();
      this.#appRef.detachView(shellRef.hostView);
      domElem.remove();
    });

    return modalRef;
  }
}

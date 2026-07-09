import { ApplicationRef, createComponent, EnvironmentInjector, Service, Type, ComponentRef, Injector, EmbeddedViewRef, inject } from '@angular/core';
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
  instance!: T;
  #resolveClose!: (value: R | undefined) => void;
  readonly afterClosed = new Promise<R | undefined>((resolve) => {
    this.#resolveClose = resolve;
  });

  _initialize(shellRef: ComponentRef<ModalTemplateComponent>, componentRef: ComponentRef<T>): void {
    this.#shellRef = shellRef;
    this.instance = componentRef.instance;
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
    component: Type<T>,
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

    if (options.title !== undefined) shellRef.setInput('title', options.title);
    if (options.width !== undefined) shellRef.setInput('width', options.width);
    if (options.maxWidth !== undefined) shellRef.setInput('maxWidth', options.maxWidth);
    if (options.closeOnOverlayClick !== undefined) shellRef.setInput('closeOnOverlayClick', options.closeOnOverlayClick);
    if (options.showCloseButton !== undefined) shellRef.setInput('showCloseButton', options.showCloseButton);
    if (options.showFooter !== undefined) shellRef.setInput('showFooter', options.showFooter);

    this.#appRef.attachView(shellRef.hostView);

    const domElem = (shellRef.hostView as EmbeddedViewRef<unknown>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    shellRef.changeDetectorRef.detectChanges();

    const viewContainerRef = shellRef.instance.modalContentRef();
    if (!viewContainerRef) {
      throw new Error('modalContentRef is not resolved');
    }

    const componentRef = viewContainerRef.createComponent(component, {
      environmentInjector: this.#injector,
      injector: modalRefInjector,
    });

    modalRef._initialize(shellRef, componentRef);

    Object.keys(inputs).forEach(key => {
      componentRef.setInput(key, inputs[key]);
    });

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

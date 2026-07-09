import { TestBed } from '@angular/core/testing';
import { Component, input, inject, ApplicationRef, TemplateRef, ViewChild } from '@angular/core';
import { ModalService, ModalRef } from './modal.service';

@Component({
  selector: 'qz-mock-content',
  template: '<div>Mock Content: {{ text() }}</div>'
})
class MockContentComponent {
  text = input<string>('');
  modalRef = inject(ModalRef);
}

@Component({
  selector: 'qz-test-parent',
  standalone: true,
  template: `
    <ng-template #myTemplate let-data>
      <div>Template Content: {{ data.value }}</div>
    </ng-template>
  `
})
class TestParentComponent {
  @ViewChild('myTemplate', { read: TemplateRef, static: true })
  template!: TemplateRef<unknown>;
}

describe('ModalService', () => {
  let service: ModalService;
  let appRef: ApplicationRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestParentComponent],
      providers: [ModalService]
    });
    service = TestBed.inject(ModalService);
    appRef = TestBed.inject(ApplicationRef);
  });

  afterEach(() => {
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(overlay => overlay.remove());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a component, append to body and return ModalRef', async () => {
    const modalRef = service.open(MockContentComponent, { text: 'Hello Test' }, { title: 'Test Title' });
    expect(modalRef).toBeTruthy();
    expect(modalRef.instance).toBeInstanceOf(MockContentComponent);

    appRef.tick();

    const overlay = document.querySelector('.modal-overlay');
    expect(overlay).toBeTruthy();
    expect(overlay?.querySelector('.modal-title')?.textContent).toContain('Test Title');
    expect(overlay?.textContent).toContain('Mock Content: Hello Test');

    modalRef.close();
  });

  it('should resolve afterClosed with result when close is called', async () => {
    const modalRef = service.open<MockContentComponent, string>(MockContentComponent, { text: 'Test' });
    let resolvedValue: string | undefined = undefined;
    modalRef.afterClosed.then((val) => {
      resolvedValue = val;
    });

    modalRef.close('Payload');
    
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(resolvedValue).toBe('Payload');
    
    const overlay = document.querySelector('.modal-overlay');
    expect(overlay).toBeNull();
  });

  it('should close the modal and resolve with undefined on shell close event', async () => {
    const modalRef = service.open<MockContentComponent, string>(MockContentComponent, { text: 'Test' });
    let resolvedValue: string | undefined = 'initial';
    modalRef.afterClosed.then((val) => {
      resolvedValue = val;
    });

    const overlay = document.querySelector('.modal-overlay');
    expect(overlay).toBeTruthy();
    
    modalRef.close();

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(resolvedValue).toBeUndefined();
    expect(document.querySelector('.modal-overlay')).toBeNull();
  });

  it('should open a TemplateRef and render its content', () => {
    const parentFixture = TestBed.createComponent(TestParentComponent);
    parentFixture.detectChanges();
    
    const templateRef = parentFixture.componentInstance.template;
    expect(templateRef).toBeTruthy();

    const modalRef = service.open(templateRef, { value: 'Hello Template' });
    expect(modalRef).toBeTruthy();
    expect(modalRef.instance).toBeNull();

    appRef.tick();

    const overlay = document.querySelector('.modal-overlay');
    expect(overlay).toBeTruthy();
    expect(overlay?.textContent).toContain('Template Content: Hello Template');

    modalRef.close();
  });
});

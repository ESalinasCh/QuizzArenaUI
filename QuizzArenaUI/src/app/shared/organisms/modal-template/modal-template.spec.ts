import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ModalTemplateComponent } from './modal-template';

describe('ModalTemplateComponent', () => {
  let component: ModalTemplateComponent;
  let fixture: ComponentFixture<ModalTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ModalTemplateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title when provided', () => {
    fixture.componentRef.setInput('title', 'My Custom Title');
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('.modal-title');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('My Custom Title');
  });

  it('should emit closedModalEvent when close button is clicked', () => {
    fixture.componentRef.setInput('title', 'Title');
    fixture.componentRef.setInput('showCloseButton', true);
    fixture.detectChanges();

    let emitted = false;
    component.closedModalEvent.subscribe(() => {
      emitted = true;
    });

    const closeBtn = fixture.nativeElement.querySelector('.modal-close-btn');
    expect(closeBtn).toBeTruthy();
    closeBtn.click();

    expect(emitted).toBe(true);
  });

  it('should emit closedModalEvent when overlay is clicked and closeOnOverlayClick is true', () => {
    fixture.componentRef.setInput('closeOnOverlayClick', true);
    fixture.detectChanges();

    let emitted = false;
    component.closedModalEvent.subscribe(() => {
      emitted = true;
    });

    const overlay = fixture.nativeElement.querySelector('.modal-overlay');
    expect(overlay).toBeTruthy();
    overlay.click();

    expect(emitted).toBe(true);
  });

  it('should NOT emit closedModalEvent when overlay is clicked and closeOnOverlayClick is false', () => {
    fixture.componentRef.setInput('closeOnOverlayClick', false);
    fixture.detectChanges();

    let emitted = false;
    component.closedModalEvent.subscribe(() => {
      emitted = true;
    });

    const overlay = fixture.nativeElement.querySelector('.modal-overlay');
    expect(overlay).toBeTruthy();
    overlay.click();

    expect(emitted).toBe(false);
  });

  it('should emit closedModalEvent on escape press', () => {
    fixture.detectChanges();

    let emitted = false;
    component.closedModalEvent.subscribe(() => {
      emitted = true;
    });

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(emitted).toBe(true);
  });
});

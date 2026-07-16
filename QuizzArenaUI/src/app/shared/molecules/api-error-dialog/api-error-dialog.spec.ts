import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalRef } from '../../../core/services/modal.service';
import { ApiErrorDialog } from './api-error-dialog';

describe('ApiErrorDialog', () => {
  let fixture: ComponentFixture<ApiErrorDialog>;
  let modalRef: { close: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    modalRef = {
      close: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ApiErrorDialog],
      providers: [{ provide: ModalRef, useValue: modalRef }],
    });

    fixture = TestBed.createComponent(ApiErrorDialog);
  });

  it('should render message and status code', () => {
    fixture.componentRef.setInput('message', 'The request failed.');
    fixture.componentRef.setInput('statusCode', 500);
    fixture.componentRef.setInput('actionLabel', 'OK');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('The request failed.');
    expect(fixture.nativeElement.textContent).toContain('Error code:');
    expect(fixture.nativeElement.textContent).toContain('500');
  });

  it('should close the modal when the action button is clicked', () => {
    fixture.componentRef.setInput('actionLabel', 'OK');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(modalRef.close).toHaveBeenCalledOnce();
  });
});

import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ModalRef, ModalService } from '../services/modal.service';
import { ApiErrorDialog } from '../../shared/molecules/api-error-dialog/api-error-dialog';
import { ApiErrorService } from './api-error.service';

describe('ApiErrorService', () => {
  let service: ApiErrorService;
  let modalService: { open: ReturnType<typeof vi.fn> };
  let modalRef: ModalRef<ApiErrorDialog>;
  let resolveAfterClosed: () => void;

  beforeEach(() => {
    modalRef = {
      afterClosed: new Promise<void>(resolve => {
        resolveAfterClosed = resolve;
      }),
    } as ModalRef<ApiErrorDialog>;

    modalService = {
      open: vi.fn(() => modalRef),
    };

    TestBed.configureTestingModule({
      providers: [
        ApiErrorService,
        { provide: ModalService, useValue: modalService },
      ],
    });

    service = TestBed.inject(ApiErrorService);
  });

  it('should open the api error dialog with mapped error data', () => {
    const error = new HttpErrorResponse({
      status: 409,
      error: {
        code: 'ACTIVE_ATTEMPT_EXISTS',
        message: 'Active attempt exists for match quiz-1.',
        status: 409,
      },
    });

    service.show(error);

    expect(modalService.open).toHaveBeenCalledWith(
      ApiErrorDialog,
      {
        message: 'You already have an active attempt for this quiz.',
        statusCode: 409,
        actionLabel: 'OK',
      },
      {
        title: 'Something went wrong',
        width: '420px',
        maxWidth: '90vw',
        closeOnOverlayClick: true,
        showCloseButton: true,
      },
    );
  });

  it('should not open another modal while one is active', () => {
    service.show(new HttpErrorResponse({ status: 500 }));
    service.show(new HttpErrorResponse({ status: 400 }));

    expect(modalService.open).toHaveBeenCalledTimes(1);
  });

  it('should allow opening another modal after the active modal is closed', async () => {
    service.show(new HttpErrorResponse({ status: 500 }));

    resolveAfterClosed();
    await modalRef.afterClosed;

    service.show(new HttpErrorResponse({ status: 400 }));

    expect(modalService.open).toHaveBeenCalledTimes(2);
  });
});

import { TestBed } from '@angular/core/testing';
import { RouterStateSnapshot } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { attemptFlowGuard } from './attempt-flow.guard';

describe('attemptFlowGuard', () => {
  let modalService: Pick<ModalService, 'open'>;

  beforeEach(() => {
    modalService = {
      open: vi.fn().mockReturnValue({
        afterClosed: Promise.resolve(false),
      }),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: ModalService, useValue: modalService }],
    });
  });

  it.each([
    ['/student/quizzes/quiz-1/start', '/student/quizzes/quiz-1/questions'],
    ['/student/quizzes/quiz-1/questions', '/student/quizzes/attempt-1/results'],
    ['/student/exams/exam-1/start', '/student/exams/exam-1/questions'],
    ['/student/exams/exam-1/questions', '/student/exams/attempt-1/results'],
  ])('should allow valid attempt transition from %s to %s', async (currentUrl, nextUrl) => {
    await expect(runGuard(currentUrl, nextUrl)).resolves.toBe(true);
    expect(modalService.open).not.toHaveBeenCalled();
  });

  it.each([
    ['/student/quizzes/quiz-1/start', '/student/quizzes'],
    ['/student/quizzes/quiz-1/questions', '/student/quizzes/quiz-1/start'],
    ['/student/exams/exam-1/start', '/student/exams'],
    ['/student/exams/exam-1/questions', '/student/exams/exam-1/start'],
  ])('should block leaving the attempt flow from %s to %s', async (currentUrl, nextUrl) => {
    await expect(runGuard(currentUrl, nextUrl)).resolves.toBe(false);
    expect(modalService.open).toHaveBeenCalled();
  });

  it('should block navigation when next state is not available', async () => {
    await expect(runGuard('/student/exams/exam-1/questions')).resolves.toBe(false);
  });
});

function runGuard(currentUrl: string, nextUrl?: string): Promise<boolean> {
  return TestBed.runInInjectionContext(() =>
    Promise.resolve(
      attemptFlowGuard(
        {},
        {} as never,
        { url: currentUrl } as RouterStateSnapshot,
        nextUrl
          ? ({ url: nextUrl } as RouterStateSnapshot)
          : (undefined as unknown as RouterStateSnapshot),
      ) as boolean | Promise<boolean>,
    ),
  );
}

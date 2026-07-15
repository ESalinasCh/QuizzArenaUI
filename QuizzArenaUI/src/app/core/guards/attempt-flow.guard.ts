import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { AttemptExitDialog } from '../../shared/molecules/attempt-exit-dialog/attempt-exit-dialog';

const ATTEMPT_EXIT_DIALOG_WIDTH = 'min(90vw, 420px)';

type AttemptRouteType = 'quizzes' | 'exams';
type AttemptRouteStep = 'start' | 'questions' | 'results';

interface AttemptRoute {
  type: AttemptRouteType;
  step: AttemptRouteStep;
}

export const attemptFlowGuard: CanDeactivateFn<unknown> = (
  _component,
  _currentRoute,
  currentState,
  nextState,
) => {
  const currentRoute = parseAttemptRoute(currentState.url);
  const nextRoute = parseAttemptRoute(nextState?.url);

  if (isAllowedAttemptTransition(currentRoute, nextRoute)) {
    return true;
  }

  return showAttemptExitDialog();
};

function parseAttemptRoute(url: string | undefined): AttemptRoute | null {
  const [area, type, id, step] = getRouteSegments(url);

  if (area !== 'student' || !isAttemptRouteType(type) || !id || !isAttemptRouteStep(step)) {
    return null;
  }

  return { type, step };
}

function getRouteSegments(url: string | undefined): string[] {
  const routePath = url?.split('?')[0];

  return routePath?.split('/').filter(Boolean) ?? [];
}

function isAttemptRouteType(value: string | undefined): value is AttemptRouteType {
  return value === 'quizzes' || value === 'exams';
}

function isAttemptRouteStep(value: string | undefined): value is AttemptRouteStep {
  return value === 'start' || value === 'questions' || value === 'results';
}

function isAllowedAttemptTransition(
  currentRoute: AttemptRoute | null,
  nextRoute: AttemptRoute | null,
): boolean {
  if (!currentRoute || !nextRoute || currentRoute.type !== nextRoute.type) {
    return false;
  }

  return (
    (currentRoute.step === 'start' && nextRoute.step === 'questions') ||
    (currentRoute.step === 'questions' && nextRoute.step === 'results')
  );
}

async function showAttemptExitDialog(): Promise<boolean> {
  const modalService = inject(ModalService);
  const modalRef = modalService.open<AttemptExitDialog, boolean>(
    AttemptExitDialog,
    {},
    {
      closeOnOverlayClick: false,
      showCloseButton: false,
      width: ATTEMPT_EXIT_DIALOG_WIDTH,
    },
  );

  return (await modalRef.afterClosed) ?? false;
}

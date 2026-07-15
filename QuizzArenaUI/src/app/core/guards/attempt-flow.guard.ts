import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { AttemptExitDialog } from '../../shared/molecules/attempt-exit-dialog/attempt-exit-dialog';

const ALLOWED_ATTEMPT_TRANSITIONS = [
  {
    from: /^\/student\/quizzes\/[^/]+\/start$/,
    to: /^\/student\/quizzes\/[^/]+\/questions$/,
  },
  {
    from: /^\/student\/quizzes\/[^/]+\/questions$/,
    to: /^\/student\/quizzes\/[^/]+\/results$/,
  },
  {
    from: /^\/student\/exams\/[^/]+\/start$/,
    to: /^\/student\/exams\/[^/]+\/questions$/,
  },
  {
    from: /^\/student\/exams\/[^/]+\/questions$/,
    to: /^\/student\/exams\/[^/]+\/results$/,
  },
];

export const attemptFlowGuard: CanDeactivateFn<unknown> = (
  _component,
  _currentRoute,
  currentState,
  nextState,
) => {
  const currentUrl = normalizeUrl(currentState.url);
  const nextUrl = normalizeUrl(nextState?.url);
  const isAllowedTransition = ALLOWED_ATTEMPT_TRANSITIONS.some(
    transition => transition.from.test(currentUrl) && transition.to.test(nextUrl),
  );

  if (isAllowedTransition) {
    return true;
  }

  return showAttemptExitDialog();
};

function normalizeUrl(url: string | undefined): string {
  return url?.split('?')[0] ?? '';
}

async function showAttemptExitDialog(): Promise<boolean> {
  const modalService = inject(ModalService);
  const modalRef = modalService.open<AttemptExitDialog, boolean>(
    AttemptExitDialog,
    {},
    {
      closeOnOverlayClick: false,
      showCloseButton: false,
      width: 'min(90vw, 420px)',
    },
  );

  return (await modalRef.afterClosed) ?? false;
}

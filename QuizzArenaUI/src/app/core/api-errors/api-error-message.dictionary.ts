export const DEFAULT_API_ERROR_MESSAGE = $localize`:API error fallback message:We could not complete this action. Please try again later.`;

export const API_ERROR_MESSAGE_DICTIONARY: Record<string, string> = {
  BAD_REQUEST: $localize`:API error bad request message:The request contains invalid data.`,
  VALIDATION_ERROR: $localize`:API error validation message:Please review the submitted data.`,
  UNAUTHORIZED: $localize`:API error unauthorized message:Your session has expired. Please sign in again.`,
  FORBIDDEN: $localize`:API error forbidden message:You do not have permission to perform this action.`,
  NOT_FOUND: $localize`:API error not found message:The requested resource was not found.`,
  CONFLICT: $localize`:API error conflict message:The request conflicts with the current state of the resource.`,
  INTERNAL_SERVER_ERROR: $localize`:API error internal server message:Something went wrong on the server. Please try again later.`,
  SERVICE_UNAVAILABLE: $localize`:API error service unavailable message:The service is temporarily unavailable. Please try again later.`,

  MATCH_NOT_FOUND: $localize`:API error match not found message:The quiz was not found.`,
  MATCH_NOT_AVAILABLE: $localize`:API error match not available message:This quiz is no longer available.`,
  MATCH_NOT_ACTIVE: $localize`:API error match not active message:This quiz is not active yet.`,
  ACTIVE_ATTEMPT_EXISTS: $localize`:API error active attempt exists message:You already have an active attempt for this quiz.`,
  ATTEMPT_NOT_FOUND: $localize`:API error attempt not found message:The quiz attempt was not found.`,
  ATTEMPT_ALREADY_SUBMITTED: $localize`:API error attempt already submitted message:This attempt has already been submitted.`,
  ATTEMPT_EXPIRED: $localize`:API error attempt expired message:The time for this attempt has expired.`,
  ATTEMPT_NOT_IN_PROGRESS: $localize`:API error attempt not in progress message:This attempt is not in progress.`,
  QUESTION_NOT_FOUND: $localize`:API error question not found message:The question was not found.`,
  OPTION_NOT_FOUND: $localize`:API error option not found message:The selected option was not found.`,
  ANSWER_REQUIRED: $localize`:API error answer required message:Please select an answer before continuing.`,
  INVALID_ANSWER_PAYLOAD: $localize`:API error invalid answer payload message:The submitted answers are invalid.`,
  ANSWERED_AT_REQUIRED: $localize`:API error answered at required message:The answer timestamp is required.`,
  MAX_ATTEMPTS_REACHED: $localize`:API error max attempts reached message:You have reached the maximum number of attempts for this quiz.`,

  COURSE_NOT_FOUND: $localize`:API error course not found message:The course was not found.`,
  QUIZ_NOT_FOUND: $localize`:API error quiz not found message:The quiz was not found.`,
  QUESTION_BANK_EMPTY: $localize`:API error question bank empty message:The question bank is empty.`,
  QUIZ_CREATION_FAILED: $localize`:API error quiz creation failed message:The quiz could not be created.`,
  MATCH_CREATION_FAILED: $localize`:API error match creation failed message:The match could not be created.`,
  INVALID_EXAM_CONFIGURATION: $localize`:API error invalid exam configuration message:The exam configuration is invalid.`,
  PUBLISH_EXAM_FAILED: $localize`:API error publish exam failed message:The exam could not be published.`,
  CONTENT_UPLOAD_FAILED: $localize`:API error content upload failed message:The content could not be uploaded.`,
  UNSUPPORTED_FILE_TYPE: $localize`:API error unsupported file type message:The selected file type is not supported.`,
};

export function resolveApiErrorMessage(code?: string, fallbackMessage?: string): string {
  if (!code) {
    return fallbackMessage ?? DEFAULT_API_ERROR_MESSAGE;
  }

  return API_ERROR_MESSAGE_DICTIONARY[code] ?? fallbackMessage ?? DEFAULT_API_ERROR_MESSAGE;
}

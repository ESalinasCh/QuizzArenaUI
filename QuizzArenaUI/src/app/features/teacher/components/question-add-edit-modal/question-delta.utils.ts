import { Question, QuestionStatus, QuestionType } from '../../models/question';
import { Option } from '../../models/options';

export interface OptionDelta {
  optionId?: string;
  description?: string;
  isCorrect?: boolean;
  position?: number;
}

export interface QuestionDelta {
  id: string;
  content?: string;
  justification?: string;
  status?: QuestionStatus;
  type?: QuestionType;
  options?: OptionDelta[];
}

export function calculateQuestionDelta(
  current: Question,
  original: Question,
  currentOptions: Option[],
  originalOptions: Option[]
): QuestionDelta {
  const delta: QuestionDelta = {
    id: current.id
  };

  if (current.content !== original.content) {
    delta.content = current.content;
  }
  if (current.justification !== original.justification) {
    delta.justification = current.justification;
  }
  if (current.status !== original.status) {
    delta.status = current.status;
  }
  if (current.type !== original.type) {
    delta.type = current.type;
  }

  // Compare Options
  const changedOptions: OptionDelta[] = [];

  currentOptions.forEach(currOpt => {
    const origOpt = originalOptions.find(o => o.position === currOpt.position);
    if (origOpt) {
      const optDelta: OptionDelta = {};
      let hasChanges = false;

      if (currOpt.description !== origOpt.description) {
        optDelta.description = currOpt.description;
        hasChanges = true;
      }
      if (currOpt.isCorrect !== origOpt.isCorrect) {
        optDelta.isCorrect = currOpt.isCorrect;
        hasChanges = true;
      }

      if (hasChanges) {
        optDelta.position = currOpt.position;
        if (currOpt.optionId || currOpt.id) {
          optDelta.optionId = currOpt.optionId || currOpt.id;
        }
        changedOptions.push(optDelta);
      }
    } else {
      // New option
      changedOptions.push({
        position: currOpt.position,
        description: currOpt.description,
        isCorrect: currOpt.isCorrect,
        ...(currOpt.optionId || currOpt.id ? { optionId: currOpt.optionId || currOpt.id } : {})
      });
    }
  });

  if (changedOptions.length > 0) {
    delta.options = changedOptions;
  }

  return delta;
}

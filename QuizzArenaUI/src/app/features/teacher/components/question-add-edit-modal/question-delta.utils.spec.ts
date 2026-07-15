import { calculateQuestionDelta } from './question-delta.utils';
import { Question } from '../../models/question';
import { Option } from '../../models/options';

describe('QuestionDeltaUtils', () => {
  let origQuestion: Question;
  let currQuestion: Question;
  let origOptions: Option[];
  let currOptions: Option[];

  beforeEach(() => {
    origQuestion = {
      id: 'q-1',
      content: 'Original Title',
      justification: 'Original Justification',
      status: 'Verified',
      type: 'SingleChoice',
      processingJobId: 'pj-1',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    currQuestion = { ...origQuestion };

    origOptions = [
      { id: 'o-1', optionId: 'o-1', description: 'Opt 1', isCorrect: true, position: 1, questionId: 'q-1' },
      { id: 'o-2', optionId: 'o-2', description: 'Opt 2', isCorrect: false, position: 2, questionId: 'q-1' }
    ];

    currOptions = origOptions.map(opt => ({ ...opt }));
  });

  it('should return only id when nothing changes', () => {
    const delta = calculateQuestionDelta(currQuestion, origQuestion, currOptions, origOptions);
    expect(delta).toEqual({ id: 'q-1' });
  });

  it('should detect question field changes', () => {
    currQuestion.content = 'Updated Title';
    currQuestion.status = 'Draft';

    const delta = calculateQuestionDelta(currQuestion, origQuestion, currOptions, origOptions);
    expect(delta.content).toBe('Updated Title');
    expect(delta.status).toBe('Draft');
    expect(delta.justification).toBeUndefined();
  });

  it('should detect option description and isCorrect changes', () => {
    currOptions[0].description = 'Opt 1 Updated';
    currOptions[1].isCorrect = true;

    const delta = calculateQuestionDelta(currQuestion, origQuestion, currOptions, origOptions);
    expect(delta.options).toBeDefined();
    expect(delta.options!.length).toBe(2);

    expect(delta.options![0]).toEqual({
      position: 1,
      optionId: 'o-1',
      description: 'Opt 1 Updated'
    });

    expect(delta.options![1]).toEqual({
      position: 2,
      optionId: 'o-2',
      isCorrect: true
    });
  });

  it('should handle newly added options', () => {
    const newOption: Option = {
      description: 'Opt 3',
      isCorrect: false,
      position: 3,
      questionId: 'q-1'
    };
    currOptions.push(newOption);

    const delta = calculateQuestionDelta(currQuestion, origQuestion, currOptions, origOptions);
    expect(delta.options).toBeDefined();
    expect(delta.options!.length).toBe(1);
    expect(delta.options![0]).toEqual({
      position: 3,
      description: 'Opt 3',
      isCorrect: false
    });
  });
});

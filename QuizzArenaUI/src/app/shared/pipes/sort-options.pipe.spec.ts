import { SortOptionsPipe } from './sort-options.pipe';
import { Option } from '../../features/teacher/models/options';

describe('SortOptionsPipe', () => {
  let pipe: SortOptionsPipe;

  beforeEach(() => {
    pipe = new SortOptionsPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array if input is null or undefined', () => {
    expect(pipe.transform(null)).toEqual([]);
    expect(pipe.transform(undefined)).toEqual([]);
  });

  it('should sort options by position in ascending order', () => {
    const options: Option[] = [
      { description: 'Opt 3', isCorrect: false, position: 3, questionId: 'q1' },
      { description: 'Opt 1', isCorrect: true, position: 1, questionId: 'q1' },
      { description: 'Opt 2', isCorrect: false, position: 2, questionId: 'q1' }
    ];

    const result = pipe.transform(options);
    expect(result.length).toBe(3);
    expect(result[0].position).toBe(1);
    expect(result[1].position).toBe(2);
    expect(result[2].position).toBe(3);
  });

  it('should not mutate original array', () => {
    const options: Option[] = [
      { description: 'Opt 2', isCorrect: false, position: 2, questionId: 'q1' },
      { description: 'Opt 1', isCorrect: true, position: 1, questionId: 'q1' }
    ];

    const result = pipe.transform(options);
    expect(options[0].position).toBe(2);
    expect(result[0].position).toBe(1);
  });
});

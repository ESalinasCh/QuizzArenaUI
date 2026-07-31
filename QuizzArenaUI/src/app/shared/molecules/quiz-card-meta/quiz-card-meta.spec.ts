import { TestBed } from '@angular/core/testing';
import { QuizCardMeta, QuizCardMetaItem } from './quiz-card-meta';

describe('QuizCardMeta', () => {
  function renderMeta(items: QuizCardMetaItem[]) {
    const fixture = TestBed.createComponent(QuizCardMeta);
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();

    return fixture;
  }

  function rowTexts(fixture: ReturnType<typeof renderMeta>): string[] {
    return Array.from(fixture.nativeElement.querySelectorAll('dl > div')).map((row) => {
      const term = (row as HTMLElement).querySelector('dt')!.textContent!.trim();
      const definition = (row as HTMLElement).querySelector('dd')!.textContent!.trim();

      return `${term} ${definition}`;
    });
  }

  it('should render one labelled row per item', () => {
    const fixture = renderMeta([
      { label: 'Questions', value: '8', icon: 'quiz' },
      { label: 'Status', value: 'In progress', variant: 'warning' },
      { label: 'Attempts left', value: '9', variant: 'success' },
    ]);

    expect(rowTexts(fixture)).toEqual(['Questions: 8', 'Status: In progress', 'Attempts left: 9']);
  });

  it('should render the icon of an item', () => {
    const fixture = renderMeta([{ label: 'Questions', value: '8', icon: 'quiz' }]);

    expect(fixture.nativeElement.querySelector('qz-icon')).toBeTruthy();
  });

  it('should render no icon when the item has none', () => {
    const fixture = renderMeta([{ label: 'Status', value: 'Available', variant: 'success' }]);

    expect(fixture.nativeElement.querySelector('qz-icon')).toBeNull();
  });

  it('should render a status label only for items with a variant', () => {
    const fixture = renderMeta([
      { label: 'Questions', value: '8' },
      { label: 'Attempts left', value: '9', variant: 'success' },
    ]);

    expect(fixture.nativeElement.querySelectorAll('qz-status-label').length).toBe(1);
  });

  it('should render nothing when there are no items', () => {
    const fixture = renderMeta([]);

    expect(rowTexts(fixture)).toEqual([]);
  });
});

import { TestBed } from '@angular/core/testing';
import { StatCard } from './stat-card';
import { By } from '@angular/platform-browser';

describe('StatCard', () => {
  it('should render label and value', () => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentRef.setInput('label', 'Correct');
    fixture.componentRef.setInput('value', 8);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Correct');
    expect(text).toContain('8');
  });

  it('should render string value', () => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentRef.setInput('label', 'Score');
    fixture.componentRef.setInput('value', '85%');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('85%');
  });

  it('should apply default blue', () => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentRef.setInput('label', 'Correct');
    fixture.componentRef.setInput('value', 5);
    fixture.detectChanges();
    const cardDebug = fixture.debugElement.query(By.css('#stat-card'));
    expect(cardDebug).toBeTruthy();
    const card = cardDebug.nativeElement as HTMLDivElement;
    expect(card.classList.contains('bg-primary-soft')).toBe(true);
    expect(card.classList.contains('dark:bg-info-bg-dark')).toBe(true);
  });

  it('should apply danger variant classes', () => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentRef.setInput('label', 'Incorrect');
    fixture.componentRef.setInput('value', 3);
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
    const article = fixture.nativeElement.querySelector('#stat-card');
    expect(article.classList.contains('bg-danger-bg-light')).toBe(true);
  });

});

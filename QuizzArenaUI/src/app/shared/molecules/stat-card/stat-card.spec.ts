import { TestBed } from '@angular/core/testing';
import { StatCard } from './stat-card';

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

  it('should default to success variant', () => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentRef.setInput('label', 'Correct');
    fixture.componentRef.setInput('value', 5);
    fixture.detectChanges();

    const article = fixture.nativeElement.querySelector('article');
    expect(article.classList.contains('bg-success-bg-light')).toBe(true);
  });

  it('should apply danger variant classes', () => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentRef.setInput('label', 'Incorrect');
    fixture.componentRef.setInput('value', 3);
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();

    const article = fixture.nativeElement.querySelector('article');
    expect(article.classList.contains('bg-danger-bg-light')).toBe(true);
  });

  it('should display value in a strong element', () => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentRef.setInput('label', 'Score');
    fixture.componentRef.setInput('value', 10);
    fixture.detectChanges();

    const strong = fixture.nativeElement.querySelector('strong');
    expect(strong).toBeTruthy();
    expect(strong.textContent).toContain('10');
  });
});

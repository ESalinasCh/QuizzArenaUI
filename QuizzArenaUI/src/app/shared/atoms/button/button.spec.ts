import { TestBed } from '@angular/core/testing';
import { Button } from './button';
import { By } from '@angular/platform-browser';

describe('Button', () => {
  it('should render with default inputs', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.detectChanges();
    const buttonEl: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonEl.type).toBe('button');
    expect(buttonEl.disabled).toBe(false);
    expect(buttonEl.getAttribute('aria-label')).toBeNull();
  });

  it('should project ng-content', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.nativeElement.textContent = 'Click me';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Click me');
  });

  it('should set type from input', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentRef.setInput('type','submit');
    fixture.detectChanges();
    const buttonEl: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonEl.type).toBe('submit');
  });

  it('should disable button when disabled input is true', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const buttonEl: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonEl.disabled).toBe(true);
  });

  it('should set aria-label when provided', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentRef.setInput('ariaLabel', 'Submit form');
    fixture.detectChanges();
    const buttonEl: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonEl.getAttribute('aria-label')).toBe('Submit form');
  });

  it('should apply fullWidth class when fullWidth is true', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentRef.setInput('fullWidth', true);
    fixture.detectChanges();
    const buttonEl: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonEl.classList.contains('w-full')).toBe(true);
  });

  it('should apply size classes correctly', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();
    const buttonEl: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonEl.classList.contains('h-12')).toBe(true);
  });

  it('should apply variant classes correctly', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
    const buttonEl: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonEl.classList.contains('bg-danger-bg-light')).toBe(true);
  });
});

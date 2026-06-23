import { TestBed } from '@angular/core/testing';
import { LinkActionForm } from './link-action-form';

describe('LinkActionForm', () => {
  it('should render placeholder and action label', () => {
    const fixture = TestBed.createComponent(LinkActionForm);
    fixture.componentRef.setInput('placeholder', 'Paste your link');
    fixture.componentRef.setInput('actionLabel', 'Join');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('placeholder')).toBe('Paste your link');
    expect(fixture.nativeElement.textContent).toContain('Join');
  });

  it('should default leading icon to link', () => {
    const fixture = TestBed.createComponent(LinkActionForm);
    fixture.componentRef.setInput('placeholder', 'Enter code');
    fixture.componentRef.setInput('actionLabel', 'Go');
    fixture.detectChanges();

    const icons = fixture.nativeElement.querySelectorAll('qz-icon');
    expect(icons.length).toBeGreaterThanOrEqual(2);
  });

  it('should allow custom leading and action icons', () => {
    const fixture = TestBed.createComponent(LinkActionForm);
    fixture.componentRef.setInput('placeholder', 'Enter value');
    fixture.componentRef.setInput('actionLabel', 'Submit');
    fixture.componentRef.setInput('leadingIcon', 'quiz');
    fixture.componentRef.setInput('actionIcon', 'check');
    fixture.detectChanges();

    const icons = fixture.nativeElement.querySelectorAll('qz-icon');
    expect(icons.length).toBeGreaterThanOrEqual(2);
  });

  it('should emit submitted with trimmed value on submit', () => {
    const fixture = TestBed.createComponent(LinkActionForm);
    fixture.componentRef.setInput('placeholder', 'Your link');
    fixture.componentRef.setInput('actionLabel', 'Start');
    fixture.detectChanges();

    let emittedValue: string | undefined;
    fixture.componentInstance.submitted.subscribe(v => (emittedValue = v));

    fixture.componentInstance.value.set('  abc-123  ');
    fixture.componentInstance.submit();

    expect(emittedValue).toBe('abc-123');
  });

  it('should sync input value to signal', () => {
    const fixture = TestBed.createComponent(LinkActionForm);
    fixture.componentRef.setInput('placeholder', 'Enter text');
    fixture.componentRef.setInput('actionLabel', 'Send');
    fixture.detectChanges();

    fixture.componentInstance.value.set('test-value');
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('test-value');
  });

  it('should emit empty string when submitting empty input', () => {
    const fixture = TestBed.createComponent(LinkActionForm);
    fixture.componentRef.setInput('placeholder', 'Type here');
    fixture.componentRef.setInput('actionLabel', 'Go');
    fixture.detectChanges();

    let emittedValue: string | undefined = 'not-called';
    fixture.componentInstance.submitted.subscribe(v => (emittedValue = v));

    fixture.componentInstance.submit();

    expect(emittedValue).toBe('');
  });
});

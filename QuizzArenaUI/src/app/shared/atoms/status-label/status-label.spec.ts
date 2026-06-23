import { TestBed } from '@angular/core/testing';
import { StatusLabel } from './status-label';

describe('StatusLabel', () => {
  it('should render the label text', () => {
    const fixture = TestBed.createComponent(StatusLabel);
    fixture.componentRef.setInput('label', 'Completed');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Completed');
  });

  it('should default to info variant', () => {
    const fixture = TestBed.createComponent(StatusLabel);
    fixture.componentRef.setInput('label', 'Active');
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('span');
    expect(span.classList.contains('text-primary')).toBe(true);
  });

  it('should apply success variant classes', () => {
    const fixture = TestBed.createComponent(StatusLabel);
    fixture.componentRef.setInput('label', 'Passed');
    fixture.componentRef.setInput('variant', 'success');
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('span');
    expect(span.classList.contains('text-success-text-light')).toBe(true);
  });

  it('should apply warning variant classes', () => {
    const fixture = TestBed.createComponent(StatusLabel);
    fixture.componentRef.setInput('label', 'Pending');
    fixture.componentRef.setInput('variant', 'warning');
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('span');
    expect(span.classList.contains('text-warning-text-light')).toBe(true);
  });

  it('should apply danger variant classes', () => {
    const fixture = TestBed.createComponent(StatusLabel);
    fixture.componentRef.setInput('label', 'Failed');
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('span');
    expect(span.classList.contains('text-danger-text-light')).toBe(true);
  });
});

import { TestBed } from '@angular/core/testing';
import { MetaText } from './meta-text';

describe('MetaText', () => {
  it('should render the text content', () => {
    const fixture = TestBed.createComponent(MetaText);
    fixture.componentRef.setInput('text', '10 questions');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('10 questions');
  });

  it('should not render an icon when icon input is null', () => {
    const fixture = TestBed.createComponent(MetaText);
    fixture.componentRef.setInput('text', 'Easy');
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('qz-icon');
    expect(icon).toBeNull();
  });

  it('should render an icon when icon input is provided', () => {
    const fixture = TestBed.createComponent(MetaText);
    fixture.componentRef.setInput('text', '5 min');
    fixture.componentRef.setInput('icon', 'clock');
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('qz-icon');
    expect(icon).toBeTruthy();
  });

  it('should display the correct icon when icon input changes', () => {
    const fixture = TestBed.createComponent(MetaText);
    fixture.componentRef.setInput('text', 'Details');
    fixture.componentRef.setInput('icon', 'clock');
    fixture.detectChanges();
    let icon = fixture.nativeElement.querySelector('qz-icon');
    expect(icon).toBeTruthy();
    fixture.componentRef.setInput('icon', 'check');
    fixture.detectChanges();
    icon = fixture.nativeElement.querySelector('qz-icon');
    expect(icon).toBeTruthy();
  });

  it('should hide icon when icon input becomes null', () => {
    const fixture = TestBed.createComponent(MetaText);
    fixture.componentRef.setInput('text', 'Details');
    fixture.componentRef.setInput('icon', 'clock');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('qz-icon')).toBeTruthy();
    fixture.componentRef.setInput('icon', null);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('qz-icon')).toBeNull();
  });
});

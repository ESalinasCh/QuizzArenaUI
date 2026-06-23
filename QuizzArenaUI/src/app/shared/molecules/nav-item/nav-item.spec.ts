import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavItem } from './nav-item';

describe('NavItem', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('should render the label text', () => {
    const fixture = TestBed.createComponent(NavItem);
    fixture.componentRef.setInput('label', 'Quizzes');
    fixture.componentRef.setInput('icon', 'quiz');
    fixture.componentRef.setInput('routerLink', '/student/quizzes');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Quizzes');
  });

  it('should render an icon', () => {
    const fixture = TestBed.createComponent(NavItem);
    fixture.componentRef.setInput('label', 'Dashboard');
    fixture.componentRef.setInput('icon', 'dashboard');
    fixture.componentRef.setInput('routerLink', '/teacher/dashboard');
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('qz-icon');
    expect(icon).toBeTruthy();
  });

  it('should render the anchor with the correct href from routerLink', () => {
    const fixture = TestBed.createComponent(NavItem);
    fixture.componentRef.setInput('label', 'Quizzes');
    fixture.componentRef.setInput('icon', 'quiz');
    fixture.componentRef.setInput('routerLink', '/student/quizzes');
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a');
    expect(anchor).toBeTruthy();
    expect(anchor.getAttribute('href')).toBe('/student/quizzes');
  });

  it('should render an anchor element with routerLinkActive', () => {
    const fixture = TestBed.createComponent(NavItem);
    fixture.componentRef.setInput('label', 'Settings');
    fixture.componentRef.setInput('icon', 'settings');
    fixture.componentRef.setInput('routerLink', '/student/settings');
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a');
    expect(anchor).toBeTruthy();
    expect(anchor.getAttribute('href')).toBeTruthy();
  });

  it('should display different icons based on input', () => {
    const fixture = TestBed.createComponent(NavItem);
    fixture.componentRef.setInput('label', 'Item');
    fixture.componentRef.setInput('icon', 'user');
    fixture.componentRef.setInput('routerLink', '/test');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('qz-icon')).toBeTruthy();
    fixture.componentRef.setInput('icon', 'settings');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('qz-icon')).toBeTruthy();
  });

  it('should update label when input changes', () => {
    const fixture = TestBed.createComponent(NavItem);
    fixture.componentRef.setInput('label', 'Quizzes');
    fixture.componentRef.setInput('icon', 'quiz');
    fixture.componentRef.setInput('routerLink', '/student/quizzes');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Quizzes');
    fixture.componentRef.setInput('label', 'Results');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Results');
  });
});

import { TestBed } from '@angular/core/testing';
import { GradeStatusLabel } from './grade-status-label';

describe('GradeStatusLabel', () => {
    it('should render the label text', () => {
        const fixture = TestBed.createComponent(GradeStatusLabel);
        fixture.componentRef.setInput('status', 'Completed');
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('Completed');
    });

    it('should apply completed variant classes', () => {
        const fixture = TestBed.createComponent(GradeStatusLabel);
        fixture.componentRef.setInput('status', 'Completed');
        fixture.componentRef.setInput('variant', 'completed');
        fixture.detectChanges();
        const span = fixture.nativeElement.querySelector('span');
        expect(span.classList.contains('bg-green-100')).toBe(true);
    });

    it('should apply InProgress variant classes', () => {
        const fixture = TestBed.createComponent(GradeStatusLabel);
        fixture.componentRef.setInput('status', 'InProgress');
        fixture.componentRef.setInput('variant', 'in-progress');
        fixture.detectChanges();
        const span = fixture.nativeElement.querySelector('span');
        expect(span.classList.contains('bg-yellow-100')).toBe(true);
    });

    it('should apply Timeout variant classes', () => {
        const fixture = TestBed.createComponent(GradeStatusLabel);
        fixture.componentRef.setInput('status', 'Timeout');
        fixture.componentRef.setInput('variant', 'timeout');
        fixture.detectChanges();
        const span = fixture.nativeElement.querySelector('span');
        expect(span.classList.contains('bg-red-100')).toBe(true);
    });
});

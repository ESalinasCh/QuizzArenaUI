import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TeacherClassSourceCard } from './class-source-card';
import { TeacherClassSource } from '../../models/class-source.model';

describe('TeacherClassSourceCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherClassSourceCard],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TeacherClassSourceCard);
    const component = fixture.componentInstance;

    // Set required input
    const mockSource: TeacherClassSource = {
      id: '1',
      name: 'Test Class Source',
      status: 'Pending',
      sourceType: 'video',
      createdAt: '2026-06-01T10:00:00Z',
      processingJobsIds: ['job-1']
    };
    fixture.componentRef.setInput('source', mockSource);

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});

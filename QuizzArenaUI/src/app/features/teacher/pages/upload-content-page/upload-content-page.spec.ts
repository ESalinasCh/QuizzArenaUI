import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { TeacherContentService } from '../../services/teacher-content.service';
import { TeacherUploadContentPage } from './upload-content-page';

describe('TeacherUploadContentPage', () => {
  let mockContentService: Partial<TeacherContentService>;

  beforeEach(() => {
    mockContentService = {
      getSubjects: vi.fn().mockReturnValue(of([
        { id: 'c1', name: 'Project I' },
        { id: 'c2', name: 'Hexagonal' },
      ])),
      uploadContent: vi.fn().mockReturnValue(of({ id: 'new-content', title: 'Test Class', status: 'in-progress', info: '5 min' })),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: TeacherContentService, useValue: mockContentService },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    });
  });

  it('should render the upload content page title', () => {
    const fixture = TestBed.createComponent(TeacherUploadContentPage);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Upload Content');
  });

  it('should render subject options', () => {
    const fixture = TestBed.createComponent(TeacherUploadContentPage);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Project I');
    expect(fixture.nativeElement.textContent).toContain('Hexagonal');
  });

  it('should show accepted extensions', () => {
    const fixture = TestBed.createComponent(TeacherUploadContentPage);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('.mp3 .mp4');
  });

  it('should show file name after file selection', () => {
    const fixture = TestBed.createComponent(TeacherUploadContentPage);
    fixture.detectChanges();
    const file = new File(['test'], 'test.mp3');
    const event = { target: { files: [file] } } as unknown as Event;
    fixture.componentInstance.onFileSelected(event);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('test.mp3');
  });

  it('should not accept non-mp3/mp4 files', () => {
    const fixture = TestBed.createComponent(TeacherUploadContentPage);
    fixture.detectChanges();
    const file = new File(['test'], 'test.pdf');
    const event = { target: { files: [file] } } as unknown as Event;
    fixture.componentInstance.onFileSelected(event);
    expect(fixture.componentInstance['file']()).toBeNull();
  });

  it('should remove file on removeFile', () => {
    const fixture = TestBed.createComponent(TeacherUploadContentPage);
    fixture.detectChanges();
    const file = new File(['test'], 'test.mp3');
    const event = { target: { files: [file] } } as unknown as Event;
    fixture.componentInstance.onFileSelected(event);
    expect(fixture.componentInstance['file']()).toBeTruthy();
    fixture.componentInstance.removeFile();
    expect(fixture.componentInstance['file']()).toBeNull();
  });

  it('should disable submit when form is invalid', () => {
    const fixture = TestBed.createComponent(TeacherUploadContentPage);
    fixture.detectChanges();
    expect(fixture.componentInstance['canSubmit']()).toBe(false);
  });

  it('should enable submit when file, className, and subjectId are provided', () => {
    const fixture = TestBed.createComponent(TeacherUploadContentPage);
    fixture.detectChanges();
    fixture.componentInstance['className'].set('Test Class');
    (fixture.componentInstance)['subjectId'].set('c1');
    const file = new File(['test'], 'test.mp3');
    const event = { target: { files: [file] } } as unknown as Event;
    fixture.componentInstance.onFileSelected(event);
    expect(fixture.componentInstance['canSubmit']()).toBe(true);
  });

  it('should call contentService.uploadContent on submit', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(TeacherUploadContentPage);
    fixture.detectChanges();
    fixture.componentInstance['className'].set('Test Class');
    fixture.componentInstance['subjectId'].set('c1');
    const file = new File(['test'], 'test.mp3');
    const event = { target: { files: [file] } } as unknown as Event;
    fixture.componentInstance.onFileSelected(event);
    fixture.componentInstance.submit();
    expect(mockContentService.uploadContent).toHaveBeenCalledWith({
      file,
      className: 'Test Class',
      subjectId: 'c1',
      review: { enabled: false },
    });
  });

  it('should not submit if canSubmit is false', () => {
    const fixture = TestBed.createComponent(TeacherUploadContentPage);
    fixture.detectChanges();
    fixture.componentInstance.submit();
    expect(mockContentService.uploadContent).not.toHaveBeenCalled();
  });

  it('should navigate back on goBack', async () => {
    const fixture = TestBed.createComponent(TeacherUploadContentPage);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.componentInstance.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/teacher/dashboard']);
  });

  it('should toggle drag state on drag events', () => {
    const fixture = TestBed.createComponent(TeacherUploadContentPage);
    fixture.detectChanges();
    expect(fixture.componentInstance['isDragging']()).toBe(false);
    fixture.componentInstance.onDragOver({ preventDefault: vi.fn() } as unknown as DragEvent);
    expect(fixture.componentInstance['isDragging']()).toBe(true);
    fixture.componentInstance.onDragLeave();
    expect(fixture.componentInstance['isDragging']()).toBe(false);
  });

  it('should set file on drop event', () => {
    const fixture = TestBed.createComponent(TeacherUploadContentPage);
    fixture.detectChanges();
    const file = new File(['test'], 'test.mp3');
    const dropEvent = { preventDefault: vi.fn(), dataTransfer: { files: [file] } } as unknown as DragEvent;
    fixture.componentInstance.onDrop(dropEvent);
    expect(fixture.componentInstance['file']()).toBeTruthy();
    expect(fixture.componentInstance['file']()?.name).toBe('test.mp3');
  });

  it('should set isDragging to false on drop', () => {
    const fixture = TestBed.createComponent(TeacherUploadContentPage);
    fixture.detectChanges();
    fixture.componentInstance['isDragging']['set'](true);
    const file = new File(['test'], 'test.mp3');
    const dropEvent = { preventDefault: vi.fn(), dataTransfer: { files: [file] } } as unknown as DragEvent;
    fixture.componentInstance.onDrop(dropEvent);
    expect(fixture.componentInstance['isDragging']()).toBe(false);
  });
});

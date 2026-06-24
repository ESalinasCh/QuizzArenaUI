import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TeacherDashboardPage } from './dashboard-page';

describe('TeacherDashboardPage', () => {
  let mockAuthService: Partial<AuthService>;

  beforeEach(() => {
    mockAuthService = {
      currentUser: vi.fn() as unknown as AuthService['currentUser'],
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    });
  });

  it('should render welcome heading with display name', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ name: 'John Teacher', username: 'teacher1' });

    const fixture = TestBed.createComponent(TeacherDashboardPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Welcome');
    expect(fixture.nativeElement.textContent).toContain('John');
  });

  it('should use username when name not available', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ username: 'teacher1', roles: ['teacher'] });

    const fixture = TestBed.createComponent(TeacherDashboardPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('teacher1');
  });

  it('should display stat cards with quiz count and published count', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue(null);

    const fixture = TestBed.createComponent(TeacherDashboardPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('8');
  });

  it('should render recent content list', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue(null);

    const fixture = TestBed.createComponent(TeacherDashboardPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Clase Project I - Semana 1');
  });

  it('should navigate to upload content on uploadContent', async () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const fixture = TestBed.createComponent(TeacherDashboardPage);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await fixture.componentInstance.uploadContent();
    expect(navigateSpy).toHaveBeenCalledWith(['/teacher/content/upload']);
  });
});

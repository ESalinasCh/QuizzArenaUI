import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  let mockAuthService: Partial<AuthService>;
  let mockThemeService: Partial<ThemeService>;

  beforeEach(() => {
    mockAuthService = {
      hasRole: vi.fn() as unknown as AuthService['hasRole'],
    };
    mockThemeService = {
      currentTheme: vi.fn() as unknown as ThemeService['currentTheme'],
      toggleTheme: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: ThemeService, useValue: mockThemeService },
      ],
    });
  });

  it('should render the QuizArena logo', () => {
    const fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading).toBeTruthy();
    expect(heading.textContent).toContain('QuizArena');
  });

  it('should close sidebar button emit closeSidebar', () => {
    const fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.closeSidebar.subscribe(() => (emitted = true));

    fixture.componentInstance.onCloseClick();
    expect(emitted).toBe(true);
  });

  it('should show nav items based on user roles', () => {
    (mockAuthService.hasRole as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

    const fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();

    const navItems = fixture.nativeElement.querySelectorAll('qz-nav-item');
    expect(navItems.length).toBeGreaterThan(0);
  });

  it('should hide nav items when user lacks the role', () => {
    (mockAuthService.hasRole as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);

    const fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();

    const navItems = fixture.nativeElement.querySelectorAll('qz-nav-item');
    expect(navItems.length).toBe(0);
  });

  it('should toggle theme on theme button click', () => {
    (mockAuthService.hasRole as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (mockThemeService.currentTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue('light');

    const fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();

    fixture.componentInstance.toggleTheme();
    expect(mockThemeService.toggleTheme).toHaveBeenCalled();
  });

  it('should render theme icon based on current theme', () => {
    (mockAuthService.hasRole as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (mockThemeService.currentTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue('dark');

    const fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();

    const icons = fixture.nativeElement.querySelectorAll('qz-icon');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should emit closeSidebar when overlay backdrop is clicked', () => {
    (mockAuthService.hasRole as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

    const fixture = TestBed.createComponent(Sidebar);
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.closeSidebar.subscribe(() => (emitted = true));

    const backdrop = fixture.nativeElement.querySelector('.fixed.inset-0');
    expect(backdrop).toBeTruthy();
    backdrop.click();
    fixture.detectChanges();

    expect(emitted).toBe(true);
  });
});

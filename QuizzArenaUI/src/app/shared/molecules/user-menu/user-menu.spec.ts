import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../../core/services/auth.service';
import { UserMenu } from './user-menu';

describe('UserMenu', () => {
  let mockAuthService: Partial<AuthService>;

  beforeEach(() => {
    mockAuthService = {
      currentUser: vi.fn() as unknown as AuthService['currentUser'],
      logout: vi.fn(),
    };
  });

  it('should show username when currentUser is set', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      id: '1',
      username: 'johndoe',
      email: 'john@test.com',
      roles: ['student'],
    });

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });
    const fixture = TestBed.createComponent(UserMenu);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('johndoe');
  });

  it('should not show username when no currentUser', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue(undefined);

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });
    const fixture = TestBed.createComponent(UserMenu);
    fixture.detectChanges();

    const usernameSpan = fixture.nativeElement.querySelector('span.text-sm.font-semibold');
    expect(usernameSpan).toBeNull();
  });

  it('should show "User" placeholder when user is undefined', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue(undefined);

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });
    const fixture = TestBed.createComponent(UserMenu);
    fixture.componentInstance.toggle();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Signed in as');
    expect(fixture.nativeElement.textContent).toContain('User');
  });

  it('should show dropdown menu when toggled open', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      id: '1',
      username: 'johndoe',
      email: 'john@test.com',
      roles: ['student'],
    });

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });
    const fixture = TestBed.createComponent(UserMenu);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Sign out');

    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Sign out');
  });

  it('should toggle dropdown open and closed', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      id: '1',
      username: 'johndoe',
      email: 'john@test.com',
      roles: ['student'],
    });

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });
    const fixture = TestBed.createComponent(UserMenu);
    fixture.detectChanges();

    fixture.componentInstance.toggle();
    expect(fixture.componentInstance.isOpened()).toBe(true);

    fixture.componentInstance.toggle();
    expect(fixture.componentInstance.isOpened()).toBe(false);
  });

  it('should call authService.logout on sign out', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      id: '1',
      username: 'johndoe',
      email: 'john@test.com',
      roles: ['student'],
    });

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });
    const fixture = TestBed.createComponent(UserMenu);
    fixture.componentInstance.toggle();
    fixture.detectChanges();

    fixture.componentInstance.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(fixture.componentInstance.isOpened()).toBe(false);
  });

  it('should set aria-expanded on toggle button', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      id: '1',
      username: 'johndoe',
      email: 'john@test.com',
      roles: ['student'],
    });

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });
    const fixture = TestBed.createComponent(UserMenu);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-expanded')).toBe('false');

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('should close dropdown on document click', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      id: '1',
      username: 'johndoe',
      email: 'john@test.com',
      roles: ['student'],
    });

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });
    const fixture = TestBed.createComponent(UserMenu);
    fixture.componentInstance.toggle();
    expect(fixture.componentInstance.isOpened()).toBe(true);

    document.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    expect(fixture.componentInstance.isOpened()).toBe(false);
  });
});

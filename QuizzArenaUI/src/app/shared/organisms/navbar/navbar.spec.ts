import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../../core/services/auth.service';
import { Navbar } from './navbar';

describe('Navbar', () => {
  let mockAuthService: Partial<AuthService>;

  beforeEach(() => {
    mockAuthService = {
      currentUser: vi.fn() as unknown as AuthService['currentUser'],
      hasRole: vi.fn() as unknown as AuthService['hasRole'],
      logout: vi.fn(),
    };
  });

  it('should emit toggleSidebar on menu button click', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue(undefined);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    });
    const fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
    let emitted = false;
    fixture.componentInstance.toggleSidebar.subscribe(() => (emitted = true));
    const menuButton = fixture.nativeElement.querySelector('qz-button');
    expect(menuButton).toBeTruthy();
    menuButton.click();
    expect(emitted).toBe(true);
  });

  it('should render language selector', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue(undefined);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    });
    const fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
    const langSelector = fixture.nativeElement.querySelector('qz-language-selector');
    expect(langSelector).toBeTruthy();
  });

  it('should render user menu', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      id: '1',
      username: 'testuser',
      email: 'test@test.com',
      roles: ['student'],
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    });
    const fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();

    const userMenu = fixture.nativeElement.querySelector('qz-user-menu');
    expect(userMenu).toBeTruthy();
  });

  it('should have a header element', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue(undefined);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    });
    const fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector('header');
    expect(header).toBeTruthy();
  });
});

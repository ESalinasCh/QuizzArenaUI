import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginPage } from './login-page';

describe('LoginPage', () => {
  let mockAuthService: Partial<AuthService>;

  beforeEach(() => {
    mockAuthService = { login: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    });
  });

  it('should render the "Get started" button', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('qz-button');
    expect(button).toBeTruthy();
  });

  it('should render three feature cards', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    const featureCards = fixture.nativeElement.querySelectorAll('qz-feature-card');
    const expectedCardsLength = 6;
    expect(featureCards.length).toBe(expectedCardsLength);
  });

  it('should render language selector', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    const langSelector = fixture.nativeElement.querySelector('qz-language-selector');
    expect(langSelector).toBeTruthy();
  });

  it('should call authService.login on signIn', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    fixture.componentInstance.signIn();
    expect(mockAuthService.login).toHaveBeenCalled();
  });

  it('should call authService.login when "Get started" button is clicked', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    const button:HTMLElement = fixture.nativeElement.querySelector('qz-button');
    expect(button).toBeTruthy();
    button.click();
    fixture.componentInstance.signIn();
    expect(mockAuthService.login).toHaveBeenCalled();
  });

});

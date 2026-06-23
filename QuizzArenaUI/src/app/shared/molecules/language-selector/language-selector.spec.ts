import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LanguageSelector } from './language-selector';

describe('LanguageSelector', () => {
  it('should show the current language label', () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'en' }] });
    const fixture = TestBed.createComponent(LanguageSelector);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('English');
  });

  it('should show Spanish label when locale is es', () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'es' }] });
    const fixture = TestBed.createComponent(LanguageSelector);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Español');
  });

  it('should default to English for unknown locale', () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'fr' }] });
    const fixture = TestBed.createComponent(LanguageSelector);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('English');
  });

  it('should open dropdown on toggle', () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'en' }] });
    const fixture = TestBed.createComponent(LanguageSelector);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeNull();

    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeTruthy();
  });

  it('should close dropdown when close is triggered', () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'en' }] });
    const fixture = TestBed.createComponent(LanguageSelector);
    fixture.componentInstance.toggle();
    fixture.detectChanges();

    expect(fixture.componentInstance.isOpen()).toBe(true);

    fixture.componentInstance.close();
    fixture.detectChanges();

    expect(fixture.componentInstance.isOpen()).toBe(false);
    expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeNull();
  });

  it('should toggle dropdown open and closed', () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'en' }] });
    const fixture = TestBed.createComponent(LanguageSelector);
    fixture.detectChanges();

    fixture.componentInstance.toggle();
    fixture.detectChanges();
    expect(fixture.componentInstance.isOpen()).toBe(true);

    fixture.componentInstance.toggle();
    fixture.detectChanges();
    expect(fixture.componentInstance.isOpen()).toBe(false);
  });

  it('should set aria-expanded on the toggle button', () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'en' }] });
    const fixture = TestBed.createComponent(LanguageSelector);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-expanded')).toBe('false');

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('should call switchTo with the correct language code on option click', () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'en' }] });
    const fixture = TestBed.createComponent(LanguageSelector);
    const switchToSpy = vi.spyOn(fixture.componentInstance, 'switchTo');
    fixture.componentInstance.toggle();
    fixture.detectChanges();

    const langButtons = fixture.nativeElement.querySelectorAll('[role="option"]');
    expect(langButtons.length).toBe(2);

    const langButtonsArray = Array.from(langButtons) as HTMLElement[];
    const esButton = langButtonsArray.find(b => b.textContent?.trim() === 'Español') as HTMLElement;
    esButton.click();

    expect(switchToSpy).toHaveBeenCalledWith('es');
  });
});

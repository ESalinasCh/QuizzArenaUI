import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

function mockMatchMedia(prefersDark: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: prefersDark && query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    mockMatchMedia(false);
  });

  describe('initialization', () => {
    it('should use saved theme from localStorage when available', () => {
      localStorage.setItem('theme', 'dark');

      service = TestBed.inject(ThemeService);

      expect(service.currentTheme()).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should fall back to light theme when no preference is saved', () => {
      service = TestBed.inject(ThemeService);

      expect(service.currentTheme()).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('setTheme', () => {
    beforeEach(() => {
      service = TestBed.inject(ThemeService);
    });

    it('should set light theme and update DOM', () => {
      service.setTheme('light');

      expect(service.currentTheme()).toBe('light');
      expect(localStorage.getItem('theme')).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should set dark theme and update DOM', () => {
      service.setTheme('dark');

      expect(service.currentTheme()).toBe('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('toggleTheme', () => {
    beforeEach(() => {
      service = TestBed.inject(ThemeService);
    });

    it('should switch from light to dark', () => {
      service.setTheme('light');

      service.toggleTheme();

      expect(service.currentTheme()).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should switch from dark to light', () => {
      service.setTheme('dark');

      service.toggleTheme();

      expect(service.currentTheme()).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});

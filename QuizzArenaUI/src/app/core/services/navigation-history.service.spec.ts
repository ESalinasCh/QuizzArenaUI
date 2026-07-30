import { TestBed } from '@angular/core/testing';
import { Event, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NavigationHistoryService } from './navigation-history.service';

describe('NavigationHistoryService', () => {
  let service: NavigationHistoryService;
  let routerEvents$: Subject<Event>;
  let mockRouter: {
    url: string;
    events: Subject<Event>;
    navigateByUrl: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    routerEvents$ = new Subject<Event>();
    mockRouter = {
      url: '/teacher/dashboard',
      events: routerEvents$,
      navigateByUrl: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        NavigationHistoryService,
        { provide: Router, useValue: mockRouter },
      ],
    });

    service = TestBed.inject(NavigationHistoryService);
  });

  it('should initialize history with current router url if available', () => {
    expect(service.getHistory()).toEqual(['/teacher/dashboard']);
    expect(service.getCurrentUrl()).toBe('/teacher/dashboard');
  });

  it('should push new routes when NavigationEnd events fire', () => {
    routerEvents$.next(new NavigationEnd(1, '/teacher/exams/bank', '/teacher/exams/bank'));
    expect(service.getHistory()).toEqual(['/teacher/dashboard', '/teacher/exams/bank']);
    expect(service.getPreviousUrl()).toBe('/teacher/dashboard');
    expect(service.getCurrentUrl()).toBe('/teacher/exams/bank');
  });

  it('should not push duplicate consecutive URLs', () => {
    routerEvents$.next(new NavigationEnd(1, '/teacher/dashboard', '/teacher/dashboard'));
    expect(service.getHistory()).toEqual(['/teacher/dashboard']);
  });

  it('should limit history size to 20 elements', () => {
    for (let i = 1; i <= 25; i++) {
      routerEvents$.next(new NavigationEnd(i, `/page-${i}`, `/page-${i}`));
    }
    const history = service.getHistory();
    expect(history.length).toBe(20);
    expect(history[history.length - 1]).toBe('/page-25');
    expect(history[0]).toBe('/page-6');
  });

  it('should navigate to previous URL on back() when history has entries', () => {
    routerEvents$.next(new NavigationEnd(1, '/teacher/exams/bank', '/teacher/exams/bank'));
    service.back('/teacher/exams/bank');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/teacher/dashboard');
  });

  it('should navigate to defaultUrl on back() when history has 1 or fewer entries', () => {
    service.back('/teacher/exams/bank');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/teacher/exams/bank');
  });
});

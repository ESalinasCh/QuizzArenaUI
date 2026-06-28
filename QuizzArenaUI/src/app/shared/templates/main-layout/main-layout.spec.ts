import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { MainLayout } from './main-layout';

describe('MainLayout', () => {
  let mockAuthService: Partial<AuthService>;
  let mockThemeService: Partial<ThemeService>;
  let eventsSubject: Subject<unknown>;
  let mockRouter: Record<string, unknown>;

  beforeEach(() => {
    mockAuthService = {
      hasRole: vi.fn() as unknown as AuthService['hasRole'],
      currentUser: vi.fn() as unknown as AuthService['currentUser'],
    };
    mockThemeService = {
      currentTheme: vi.fn() as unknown as ThemeService['currentTheme'],
      toggleTheme: vi.fn(),
    };
    eventsSubject = new Subject<unknown>();

    mockRouter = {
      events: eventsSubject.asObservable(),
    };
  });

  function createFixture(routeData: Record<string, unknown> = {}, firstChild: unknown = null) {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ThemeService, useValue: mockThemeService },
        {
          provide: ActivatedRoute,
          useValue: {
            firstChild: firstChild,
            snapshot: { data: routeData },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
    return fixture;
  }

  it('should not be immersive on non-immersive routes', () => {
    const fixture = createFixture({ immersive: false });
    fixture.detectChanges();

    expect(fixture.componentInstance.isImmersiveRoute()).toBe(false);
  });

  it('should be immersive when route data has immersive flag', () => {
    const fixture = createFixture({ immersive: true });

    eventsSubject.next(new NavigationEnd(1, '/immersive', '/immersive'));
    fixture.detectChanges();

    expect(fixture.componentInstance.isImmersiveRoute()).toBe(true);
  });

  it('should toggle sidebar open and closed', () => {
    const fixture = createFixture();

    expect(fixture.componentInstance.isSidebarOpen()).toBe(false);

    fixture.componentInstance.toggleSidebar();
    expect(fixture.componentInstance.isSidebarOpen()).toBe(true);

    fixture.componentInstance.toggleSidebar();
    expect(fixture.componentInstance.isSidebarOpen()).toBe(false);
  });

  it('should close sidebar', () => {
    const fixture = createFixture();

    fixture.componentInstance.toggleSidebar();
    expect(fixture.componentInstance.isSidebarOpen()).toBe(true);

    fixture.componentInstance.closeSidebar();
    expect(fixture.componentInstance.isSidebarOpen()).toBe(false);
  });

  // it('should detect immersive mode through deepest route', () => {
  //   const fixture = createFixture({});

  //   const deepestRoute = {
  //     firstChild: null,
  //     snapshot: { data: { immersive: true } },
  //   };

  //   (TestBed.inject(ActivatedRoute) as any).firstChild = deepestRoute;

  //   eventsSubject.next(new NavigationEnd(1, '/quiz/1', '/quiz/1'));
  //   fixture.detectChanges();

  //   expect(fixture.componentInstance.isImmersiveRoute()).toBe(true);
  // });

  it('should not be immersive when deepest route lacks immersive flag', () => {
    const fixture = createFixture({});

    eventsSubject.next(new NavigationEnd(1, '/student/quizzes', '/student/quizzes'));
    fixture.detectChanges();

    expect(fixture.componentInstance.isImmersiveRoute()).toBe(false);
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;
  let mockOAuthService: { getAccessToken: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockOAuthService = { getAccessToken: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: OAuthService, useValue: mockOAuthService },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should add Authorization Bearer header when access token exists', () => {
    mockOAuthService.getAccessToken.mockReturnValue('keycloak-token-123');
    httpClient.get('/api/test').subscribe();
    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer keycloak-token-123');
    req.flush({});
  });

  it('should not add Authorization header when there is no access token', () => {
    mockOAuthService.getAccessToken.mockReturnValue('');
    httpClient.get('/api/test').subscribe();
    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should not add Authorization header when token is null', () => {
    mockOAuthService.getAccessToken.mockReturnValue(null);
    httpClient.get('/api/test').subscribe();
    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should pass request through unchanged when no token', () => {
    mockOAuthService.getAccessToken.mockReturnValue(null);
    httpClient.get('/api/test', {
      headers: { 'X-Custom': 'value' },
    }).subscribe();
    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.get('X-Custom')).toBe('value');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});

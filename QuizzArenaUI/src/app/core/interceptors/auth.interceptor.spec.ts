import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;
  let mockAuthService: { getValidAccessToken: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockAuthService = { getValidAccessToken: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should add Authorization Bearer header when access token exists', async () => {
    mockAuthService.getValidAccessToken.mockResolvedValue('keycloak-token-123');
    httpClient.get('/api/test').subscribe();
    await Promise.resolve();
    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer keycloak-token-123');
    req.flush({});
  });

  it('should not add Authorization header when there is no access token', async () => {
    mockAuthService.getValidAccessToken.mockResolvedValue(null);
    httpClient.get('/api/test').subscribe();
    await Promise.resolve();
    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should pass request through unchanged when no token', async () => {
    mockAuthService.getValidAccessToken.mockResolvedValue(null);
    httpClient.get('/api/test', {
      headers: { 'X-Custom': 'value' },
    }).subscribe();
    await Promise.resolve();
    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.get('X-Custom')).toBe('value');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should not request a valid token for Keycloak token requests', () => {
    httpClient.post('/realms/master/protocol/openid-connect/token', {}).subscribe();

    const req = httpTesting.expectOne('/realms/master/protocol/openid-connect/token');
    expect(mockAuthService.getValidAccessToken).not.toHaveBeenCalled();
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});

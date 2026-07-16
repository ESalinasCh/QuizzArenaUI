import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiErrorService } from '../api-errors/api-error.service';
import { apiErrorInterceptor } from './api-error.interceptor';

describe('apiErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;
  let apiErrorService: { show: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    apiErrorService = {
      show: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: ApiErrorService, useValue: apiErrorService },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should show the api error modal when the request fails', () => {
    httpClient.get('/api/test').subscribe({
      error: () => undefined,
    });

    const req = httpTesting.expectOne('/api/test');
    req.flush(
      { message: 'Request failed', status: 500 },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(apiErrorService.show).toHaveBeenCalledOnce();
    expect(apiErrorService.show.mock.calls[0][0].status).toBe(500);
  });

  it('should not show the api error modal when the request succeeds', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    req.flush({});

    expect(apiErrorService.show).not.toHaveBeenCalled();
  });
});

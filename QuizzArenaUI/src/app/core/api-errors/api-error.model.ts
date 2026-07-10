export interface ApiErrorResponse {
  code?: string;
  message?: string;
  status?: number;
}

export interface ApiErrorViewModel {
  message: string;
  statusCode: number | null;
  actionLabel: string;
}

export interface ApiErrorConfig {
  fallbackMessage?: string;
  actionLabel?: string;
}

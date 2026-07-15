export interface ApiErrorItem {
  code?: string;
  message?: string;
}

export interface ApiErrorResponse {
  code?: string;
  message?: string;
  status?: number;
  errors?: ApiErrorItem[];
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

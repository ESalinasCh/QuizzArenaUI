import { HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { AppConfig } from "../config/app-config";

let runtimeConfig: AppConfig | null = null;

export function setRuntimeConfig(config: AppConfig): void {
  runtimeConfig = config;
}

export function buildApiUrl(endpoint: string): string {
  const base = runtimeConfig?.apiBaseUrl || environment.apiBaseUrl;
  return `${base}${endpoint}`;
}

export function buildHttpParams(obj?: Record<string, any>): HttpParams {
  let params = new HttpParams();
  if (!obj) return params;

  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(val => {
          params = params.append(key, val.toString());
        });
      } else {
        params = params.set(key, value.toString());
      }
    }
  });

  return params;
}

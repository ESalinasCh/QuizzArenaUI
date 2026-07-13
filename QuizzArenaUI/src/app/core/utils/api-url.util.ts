import { environment } from "../../../environments/environment";

export function buildApiUrl(endpoint: string): string {
	return `${environment.apiBaseUrl}${endpoint}`;
}

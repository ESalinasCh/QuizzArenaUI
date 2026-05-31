import { User } from './user.model';

export type AuthState =
  | { isAuthenticated: false }
  | { isAuthenticated: true; user: User };

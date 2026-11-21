import { createContext } from 'react';
import type { User } from './types';
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
export type AuthContextValue = {
user: User | null;
status: AuthStatus;
login: (email: string, password: string) => Promise<void>;
register: (name: string, email: string, password: string) => Promise<void>;
logout: () => Promise<void>;
};
export const AuthContext = createContext<AuthContextValue | undefined>
(undefined);
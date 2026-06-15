import { createContext, useContext, useMemo, useState } from 'react';
import {
  clearAuthTokens,
  getRefreshToken,
  hasAuthToken,
  saveAuthTokens,
} from './authStorage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasAuthToken());

  const value = useMemo(
    () => ({
      isAuthenticated,
      refreshToken: getRefreshToken(),
      loginWithTokens(tokenResponse) {
        saveAuthTokens(tokenResponse);
        setIsAuthenticated(true);
      },
      clearSession() {
        clearAuthTokens();
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.');
  }

  return auth;
}

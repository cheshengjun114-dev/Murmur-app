import { createContext, useContext, useMemo, useState } from 'react';
import {
  clearAuthTokens,
  getRefreshToken,
  getUserRole,
  hasAuthToken,
  saveAuthTokens,
} from './authStorage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasAuthToken());
  const [userRole, setUserRole] = useState(() => getUserRole());

  const value = useMemo(
    () => ({
      isAuthenticated,
      userRole,
      refreshToken: getRefreshToken(),
      loginWithTokens(tokenResponse) {
        saveAuthTokens(tokenResponse);
        setIsAuthenticated(true);
        setUserRole(getUserRole());
      },
      clearSession() {
        clearAuthTokens();
        setIsAuthenticated(false);
        setUserRole(null);
      },
    }),
    [isAuthenticated, userRole],
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

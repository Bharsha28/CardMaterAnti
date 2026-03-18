import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

const parseUser = (token) => {
  if (!token) return null;
  if (token.startsWith('MOCK_')) {
    try {
      return JSON.parse(token.slice(5));
    } catch { return null; }
  }
  try {
    const clean = token.startsWith('Bearer ') ? token.slice(7) : token;
    return jwtDecode(clean);
  } catch { return null; }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem('token');
    return t ? parseUser(t) : null;
  });

  const login = useCallback((tokenValue) => {
    const fullToken = tokenValue.startsWith('Bearer ') || tokenValue.startsWith('MOCK_') 
      ? tokenValue 
      : `Bearer ${tokenValue}`;
    localStorage.setItem('token', fullToken);
    const decoded = parseUser(fullToken);
    setToken(fullToken);
    setUser(decoded);
  }, []);

  const mockLogin = useCallback((role) => {
    const mockUser = { sub: `${role.toLowerCase()}@cardmaster.com`, role: role };
    const mockToken = `MOCK_${JSON.stringify(mockUser)}`;
    localStorage.setItem('token', mockToken);
    setToken(mockToken);
    setUser(mockUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const role = useMemo(() => {
    if (user?.role) return user.role;
    return user?.roles?.[0]?.replace('ROLE_', '') || null;
  }, [user]);

  return (
    <AuthContext.Provider value={{ token, user, role, login, mockLogin, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

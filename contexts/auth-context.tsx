
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  login as loginService,
  register as registerService,
  getCurrentUser,
  logout as logoutService,
  type AuthenticatedUser,
} from '@/services/auth/auth-service';

type AuthContextType = {
  user: AuthenticatedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Session restoration error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const authenticatedUser = await loginService(email, password);
      setUser(authenticatedUser);
    },
    []
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      phone: string,
      password: string
    ) => {
      const authenticatedUser = await registerService(
        name,
        email,
        phone,
        password
      );

      setUser(authenticatedUser);
    },
    []
  );

  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth doit être utilisé à l’intérieur de AuthProvider.'
    );
  }

  return context;
}

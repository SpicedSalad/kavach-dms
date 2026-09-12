import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { aiService } from '../services/aiService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [backendOnline, setBackendOnline] = useState(false);
  const [aiOnline, setAiOnline] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(() => {
    return localStorage.getItem('kavach_demo_mode') === 'true' || !authService.isAuthenticated();
  });

  // Check backend & AI connectivity
  useEffect(() => {
    let mounted = true;

    async function checkServices() {
      // 1. Check Backend (/test or /api/cases)
      try {
        const backendRes = await fetch('/test', { method: 'GET' });
        if (mounted) setBackendOnline(backendRes.ok || backendRes.status === 401 || backendRes.status === 403);
      } catch {
        if (mounted) setBackendOnline(false);
      }

      // 2. Check AI Service (/ai-api/health)
      try {
        const aiHealth = await aiService.checkHealth();
        if (mounted) setAiOnline(aiHealth.status === 'healthy');
      } catch {
        if (mounted) setAiOnline(false);
      }
    }

    checkServices();
    const interval = setInterval(checkServices, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const login = async (email, password, asDemo = false) => {
    if (asDemo) {
      const demoUser = {
        email: email || 'officer@kavach.gov.in',
        name: email?.includes('admin') ? 'ADMINISTRATOR' : 'INSP. R. SHARMA',
        role: email?.includes('admin') ? 'ADMIN' : 'OFFICER',
        badge: 'CYBER-402',
      };
      localStorage.setItem('kavach_user', JSON.stringify(demoUser));
      localStorage.setItem('kavach_demo_mode', 'true');
      setUser(demoUser);
      setIsDemoMode(true);
      return demoUser;
    }

    try {
      const authenticatedUser = await authService.login(email, password);
      setUser(authenticatedUser);
      setIsDemoMode(false);
      localStorage.setItem('kavach_demo_mode', 'false');
      return authenticatedUser;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => {
      const next = !prev;
      localStorage.setItem('kavach_demo_mode', String(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        backendOnline,
        aiOnline,
        isDemoMode,
        toggleDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

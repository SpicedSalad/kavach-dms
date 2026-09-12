import { setStoredToken, clearStoredToken, getStoredToken } from './api';

export const authService = {
  /**
   * Log in to KavachDMS Spring Boot backend
   * Endpoint: POST /auth/login (accepts email & password request parameters)
   */
  async login(email, password) {
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('password', password);

    const response = await fetch(`/auth/login?${params.toString()}`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Invalid email or password');
    }

    const token = await response.text();
    setStoredToken(token);

    // Decode basic user info from JWT or build user object
    const user = {
      email,
      name: email.split('@')[0].toUpperCase(),
      role: email.toLowerCase().includes('admin') ? 'ADMIN' : 'OFFICER',
      token,
    };
    localStorage.setItem('kavach_user', JSON.stringify(user));
    return user;
  },

  logout() {
    clearStoredToken();
  },

  getCurrentUser() {
    const userJson = localStorage.getItem('kavach_user');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    const token = getStoredToken();
    if (token) {
      return {
        email: 'officer@kavach.gov.in',
        name: 'INSP. R. SHARMA',
        role: 'ADMIN',
        token,
      };
    }
    return null;
  },

  isAuthenticated() {
    return !!getStoredToken();
  },
};

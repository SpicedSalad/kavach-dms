// Base HTTP Client for KavachDMS Backend & AI

const TOKEN_KEY = 'kavach_jwt_token';

export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('kavach_user');
};

/**
 * Standard HTTP request wrapper with JWT authentication
 */
export async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    ...(options.headers || {}),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Unless it's FormData, default to JSON
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(endpoint, config);

    if (response.status === 401) {
      // Unauthorized or token expired
      console.warn(`[API] 401 Unauthorized for ${endpoint}`);
    }

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.text();
        try {
          const json = JSON.parse(errorData);
          errorMessage = json.message || json.error || json.detail || errorData;
        } catch {
          if (errorData) errorMessage = errorData;
        }
      } catch (err) {
        // ignore body parse failure
      }
      const error = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }

    // Return text if body is plain string or empty
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    const text = await response.text();
    return text;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      error.isNetworkError = true;
    }
    throw error;
  }
}

export const api = {
  get: (url, options) => request(url, { method: 'GET', ...options }),
  post: (url, data, options) =>
    request(url, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
      ...options,
    }),
  put: (url, data, options) =>
    request(url, {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
      ...options,
    }),
  delete: (url, options) => request(url, { method: 'DELETE', ...options }),
  upload: (url, formData, options) =>
    request(url, {
      method: 'POST',
      body: formData,
      ...options,
    }),
};

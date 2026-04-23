const TOKEN_KEY = 'auth_token';
const PERSISTENCE_KEY = 'auth_persistence';

export type TokenPersistence = 'local' | 'session';

export const getTokenPersistence = (): TokenPersistence => {
  const stored = localStorage.getItem(PERSISTENCE_KEY);
  return stored === 'local' ? 'local' : 'session';
};

export const setStoredToken = (token: string, persistence: TokenPersistence) => {
  localStorage.setItem(PERSISTENCE_KEY, persistence);

  if (persistence === 'local') {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(TOKEN_KEY);
    return;
  }

  sessionStorage.setItem(TOKEN_KEY, token);
  localStorage.removeItem(TOKEN_KEY);
};

export const getStoredToken = (): string | null =>
  localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);

export const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};


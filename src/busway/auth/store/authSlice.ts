import { apiLogin, apiLogout, apiMe, apiRefresh, apiRegister } from '../api/auth.api';
import { api } from '../../../shared/api/httpClient';
import type { AuthState, LoginPayload, RegisterPayload, User } from '../components/auth-dto';
import {
    clearStoredToken,
    getTokenPersistence,
    getStoredToken,
    setStoredToken,
    type TokenPersistence,
} from '../../../shared/auth/tokenStorage';

type Subscriber = (state: AuthState) => void;
const subscribers = new Set<Subscriber>();

const setAuthHeader = (token: string | null) => {
    if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
    else delete api.defaults.headers.common.Authorization;
};

let state: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: !!getStoredToken(),
    error: null,
};

const notify = () => subscribers.forEach((s) => s(state));

const setState = (next: Partial<AuthState>) => {
    state = { ...state, ...next };
    notify();
};

export const getAuthState = (): AuthState => state;

export const subscribeAuthState = (fn: Subscriber) => {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
};

export const clearError = () => setState({ error: null });

const extractError = (err: any): string =>
    err?.response?.data?.message ?? err?.message ?? 'Une erreur est survenue';

const getPersistence = (rememberMe: boolean): TokenPersistence =>
    rememberMe ? 'local' : 'session';

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
    try {
        const [, payload] = token.split('.');
        if (!payload) return null;
        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
        return JSON.parse(decoded) as Record<string, unknown>;
    } catch {
        return null;
    }
};

const mapRole = (rawRole: unknown): User['role'] => {
    if (rawRole === 'ADMIN') return 'ADMIN';
    if (Array.isArray(rawRole) && rawRole.includes('ADMIN')) return 'ADMIN';
    return 'USER';
};

const fallbackUserFromToken = (token: string, emailHint?: string): User => {
    const payload = decodeJwtPayload(token) ?? {};
    const email =
        (typeof payload.email === 'string' ? payload.email : undefined) ??
        (typeof payload.sub === 'string' && payload.sub.includes('@') ? payload.sub : undefined) ??
        emailHint ??
        'user@local';

    return {
        id: Number(payload.userId ?? payload.id ?? 0) || 0,
        username: typeof payload.sub === 'string' ? payload.sub : email,
        email,
        role: mapRole(payload.role ?? payload.roles ?? payload.authorities),
    };
};

const resolveUser = async (token: string, emailHint?: string): Promise<User> => {
    try {
        return (await apiMe()).data.data;
    } catch {
        return fallbackUserFromToken(token, emailHint);
    }
};

const establishSession = async (token: string, persistence: TokenPersistence, emailHint?: string): Promise<User> => {
    setStoredToken(token, persistence);
    setAuthHeader(token);

    const user = await resolveUser(token, emailHint);
    setState({ user, isAuthenticated: true, loading: false, error: null });
    return user;
};

export const login = async (payload: LoginPayload): Promise<User> => {
    setState({ loading: true, error: null });
    try {
        const res = await apiLogin(payload);
        const token = res.data.data.token;
        return await establishSession(token, getPersistence(payload.rememberMe), payload.email);
    } catch (err: any) {
        const message = extractError(err);
        setState({ user: null, isAuthenticated: false, loading: false, error: message });
        throw new Error(message);
    }
};

export const register = async (payload: RegisterPayload): Promise<User> => {
    setState({ loading: true, error: null });
    try {
        const res = await apiRegister(payload);
        const registerToken = res.data.data.accessToken ?? res.data.data.token;

        if (registerToken) {
            return await establishSession(registerToken, getPersistence(payload.rememberMe), payload.email);
        }

        const loginRes = await apiLogin(payload);
        const token = loginRes.data.data.token;
        return await establishSession(token, getPersistence(payload.rememberMe), payload.email);
    } catch (err: any) {
        const message = extractError(err);
        setState({ user: null, isAuthenticated: false, loading: false, error: message });
        throw new Error(message);
    }
};

export const logout = async () => {
    try {
        const token = getStoredToken();
        if (token) await apiLogout(token);
    } catch {
        // silent
    } finally {
        clearStoredToken();
        setAuthHeader(null);
        setState({ user: null, isAuthenticated: false, loading: false, error: null });
    }
};

export const checkAuthStatus = async (): Promise<User | null> => {
    const token = getStoredToken();
    if (!token) {
        setState({ user: null, isAuthenticated: false, loading: false, error: null });
        return null;
    }

    setAuthHeader(token);
    setState({ loading: true });

    try {
        const user = await resolveUser(token);
        setState({ user, isAuthenticated: true, loading: false, error: null });
        return user;
    } catch {
        try {
            const refreshData = (await apiRefresh()).data.data;
            const newToken = refreshData.token ?? refreshData.accessToken;
            if (!newToken) throw new Error('Refresh token response missing access token');
            // Refresh keeps the currently selected persistence mode.
            setStoredToken(newToken, getTokenPersistence());
            setAuthHeader(newToken);

            const user = await resolveUser(newToken);
            setState({ user, isAuthenticated: true, loading: false, error: null });
            return user;
        } catch {
            clearStoredToken();
            setAuthHeader(null);
            setState({ user: null, isAuthenticated: false, loading: false, error: null });
            return null;
        }
    }
};
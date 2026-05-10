import { apiLogin, apiLogout, apiMe, apiRefresh, apiRegister } from '../api/auth.api';
import { api } from '../../shared/api/httpClient';
import type { AuthState, LoginPayload, RegisterPayload, User } from '../auth-dto';
import {
    clearStoredToken,
    getTokenPersistence,
    getStoredToken,
    setStoredToken,
    type TokenPersistence,
} from '../../shared/auth/tokenStorage';

type Subscriber = (state: AuthState) => void;
const subscribers = new Set<Subscriber>();

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

export const getAuthState = () => state;

export const subscribeAuthState = (fn: Subscriber) => {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
};

const setAuthHeader = (token: string | null) => {
    if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
    else delete api.defaults.headers.common.Authorization;
};

const decodeJwt = (token: string): any => {
    try {
        const [, payload] = token.split('.');
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
};

const fallbackUserFromToken = (token: string, emailHint?: string): User => {
    const payload = decodeJwt(token) ?? {};

    return {
        id: typeof payload.sub === 'string' ? payload.sub : '',
        username: payload.sub ?? 'user',
        email: payload.email ?? emailHint ?? 'user@local',
        role: payload.role === 'ADMIN' ? 'ADMIN' : 'USER',
    };
};

const resolveUser = async (token: string, emailHint?: string): Promise<User> => {
    try {
        return (await apiMe()).data.data;
    } catch {
        return fallbackUserFromToken(token, emailHint);
    }
};

const establishSession = async (
    token: string,
    persistence: TokenPersistence,
    emailHint?: string
): Promise<User> => {
    setStoredToken(token, persistence);
    setAuthHeader(token);

    const user = await resolveUser(token, emailHint);

    setState({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
    });

    return user;
};

export const login = async (payload: LoginPayload) => {
    setState({ loading: true });

    try {
        const res = await apiLogin(payload);
        return await establishSession(
            res.data.data.token,
            payload.rememberMe ? 'local' : 'session',
            payload.email
        );
    } catch (err: any) {
        setState({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: err.message,
        });
        throw err;
    }
};

export const logout = async () => {
    try {
        const token = getStoredToken();
        if (token) await apiLogout(token);
    } finally {
        clearStoredToken();
        setAuthHeader(null);
        setState({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
        });
    }
};

export const checkAuthStatus = async () => {
    const token = getStoredToken();

    if (!token) {
        setState({ loading: false });
        return null;
    }

    setAuthHeader(token);
    setState({ loading: true });

    try {
        const user = await resolveUser(token);
        setState({ user, isAuthenticated: true, loading: false });
        return user;
    } catch {
        try {
            const refresh = (await apiRefresh()).data.data;

            const newToken = refresh.token ?? refresh.accessToken;

            if (!newToken) {
                clearStoredToken();
                setAuthHeader(null);
                setState({ user: null, isAuthenticated: false, loading: false });
                return null;
            }

            setStoredToken(newToken, getTokenPersistence());
            setAuthHeader(newToken);

            const user = await resolveUser(newToken);
            setState({ user, isAuthenticated: true, loading: false });
            return user;

        } catch {
            clearStoredToken();
            setAuthHeader(null);
            setState({ user: null, isAuthenticated: false, loading: false });
            return null;
        }
    }
};

export const register = async (payload: RegisterPayload) => {
    setState({ loading: true });

    try {
        const res = await apiRegister(payload);
        const token = res.data.data.token ?? res.data.data.accessToken;

        if (!token) throw new Error('No token returned from register');

        return await establishSession(
            token,
            payload.rememberMe ? 'local' : 'session',
            payload.email
        );
    } catch (err: any) {
        setState({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: err.message,
        });
        throw err;
    }
};

export const clearError = () => setState({ error: null });
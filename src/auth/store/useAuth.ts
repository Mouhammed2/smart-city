import { useSyncExternalStore } from 'react';
import { getAuthState, subscribeAuthState } from './authSlice';

export const useAuth = () =>
    useSyncExternalStore(subscribeAuthState, getAuthState, getAuthState);
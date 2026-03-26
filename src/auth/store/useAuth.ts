import { useSyncExternalStore } from 'react';
import { getAuthState, subscribeAuthState } from './authSlice';

export const useAuth = () => {
  return useSyncExternalStore(subscribeAuthState, getAuthState, getAuthState);
};


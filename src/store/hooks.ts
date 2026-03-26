import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../busWay/types';
import type { store } from './store';

export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

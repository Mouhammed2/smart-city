import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAllBuses, fetchNearestBuses } from '../store/slices/busSlice';

export const useBuses = () => {
  const dispatch = useAppDispatch();
  const { buses, nearestBuses, loading, error } = useAppSelector((state) => state.buses);

  useEffect(() => {
    dispatch(fetchAllBuses());
  }, [dispatch]);

  const getNearestBuses = (lat: number, lng: number, radius?: number) => {
    dispatch(fetchNearestBuses({ lat, lng, radius }));
  };

  return {
    buses,
    nearestBuses,
    loading,
    error,
    getNearestBuses,
  };
};
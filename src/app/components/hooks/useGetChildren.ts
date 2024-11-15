import { useState, useEffect } from 'react';
import { Child, fetchAllChildren } from '@/app/utils/fetchChildren';
import { FetchChildrenResponse } from '@/app/utils/types';

export const useChildren = () => {
  const [activePatients, setActivePatients] = useState<number>(0);
  const [inactivePatients, setInactivePatients] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getChildren = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching children from API...');
        const response: FetchChildrenResponse = await fetchAllChildren();
        console.log('API response:', response);

        const children: Child [] = response?.child ?? [];

        const active = children.filter(child => !child.is_deleted).length;
        const inactive = children.filter(child => child.is_deleted).length;

        setActivePatients(active);
        setInactivePatients(inactive);
      } catch (err) {
        console.error('Error fetching children:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    getChildren();
  }, []);

  return { activePatients, inactivePatients, loading, error };
};
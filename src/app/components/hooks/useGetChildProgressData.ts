import fetchProgressData from '@/app/utils/fetchProgressData';
import { useState, useEffect } from 'react';

const useGetProgressData = (childId: string) => {
  const [progressData, setProgressData] = useState({ labels: [], values: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProgressData = async () => {
      if (!childId) {
        setProgressData({ labels: [], values: [] });
        return; 
      }
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProgressData(childId);
        setProgressData(data);
      } catch (err) {
        setError('Failed to fetch progress data');
      } finally {
        setLoading(false);
      }
    };

    getProgressData();
  }, [childId]); 

  return { progressData, loading, error };
};

export default useGetProgressData;

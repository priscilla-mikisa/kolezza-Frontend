import { fetchTherapists, Therapist } from '@/app/utils/fetchTherapists';
import { useState, useEffect } from 'react';
export interface TherapistData {
  length: number;
  weeklyCount: number;
  monthlyCount: number;
  activeCount: number;
}
export const useFetchTherapists = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [therapistData, setTherapistData] = useState<TherapistData>({
    length: 0,
    weeklyCount: 0,
    monthlyCount: 0,
    activeCount: 0,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTherapists();
        setTherapists(data);
        setTherapistData({
          length: data.length,
          weeklyCount: data.filter(t => t.updated_at && isWithinLast(t.updated_at, 7)).length,
          monthlyCount: data.filter(t => t.updated_at && isWithinLast(t.updated_at, 30)).length,
          activeCount: data.filter(t => t.updated_at && isWithinLast(t.updated_at, 28)).length,
        });
      } catch (error) {
        console.error('Error loading therapists data:', error);
      }
    };
    fetchData();
  }, []);
  return { therapists, ...therapistData };
};
const isWithinLast = (date: string, days: number): boolean => {
  const dateObj = new Date(date).getTime();
  const now = Date.now();
  return now - dateObj <= days * 24 * 60 * 60 * 1000;
};
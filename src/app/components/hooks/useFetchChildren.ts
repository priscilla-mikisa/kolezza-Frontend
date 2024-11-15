// import { Child, fetchChildren } from '@/app/utils/fetchChildren';
// import { useState, useEffect } from 'react';

// export interface ChildData {
//   length: number;
//   weeklyCount: number;
//   monthlyCount: number;
//   activeCount: number;
// }
// export const useFetchChildren = () => {
//   const [children, setChildren] = useState<Child[]>([]);
//   const [childData, setChildData] = useState<ChildData>({
//     length: 0,
//     weeklyCount: 0,
//     monthlyCount: 0,
//     activeCount: 0,
//   });
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await fetchChildren();
//         setChildren(data);
//         setChildData({
//           length: data.length,
//           weeklyCount: data.filter((c: { updated_at: string; }) => c.updated_at && isWithinLast(c.updated_at, 7)).length,
//           monthlyCount: data.filter((c: { updated_at: string; }) => c.updated_at && isWithinLast(c.updated_at, 30)).length,
//           activeCount: data.filter((c: { updated_at: string; }) => c.updated_at && isWithinLast(c.updated_at, 28)).length,
//         });
//       } catch (error) {
//         console.error('Error loading children data:', error);
//       }
//     };
//     fetchData();
//   }, []);
//   return { children, ...childData };
// };
// const isWithinLast = (date: string, days: number): boolean => {
//   const dateObj = new Date(date).getTime();
//   const now = Date.now();
//   return now - dateObj <= days * 24 * 60 * 60 * 1000;
// };

import { Child, fetchChildren } from '@/app/utils/fetchChildren';
import { useState, useEffect } from 'react';

export interface ChildData {
  length: number;
  weeklyCount: number;
  monthlyCount: number;
  activeCount: number;
}

export const useFetchChildren = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [childData, setChildData] = useState<ChildData>({
    length: 0,
    weeklyCount: 0,
    monthlyCount: 0,
    activeCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchChildren();
        setChildren(data);
        setChildData({
          length: data.length,
          weeklyCount: data.filter((c: Child) => c.updated_at != null && isWithinLast(c.updated_at, 7)).length,
          monthlyCount: data.filter((c: Child) => c.updated_at != null && isWithinLast(c.updated_at, 30)).length,
          activeCount: data.filter((c: Child) => c.updated_at != null && isWithinLast(c.updated_at, 28)).length,
        });
      } catch (error) {
        console.error('Error loading children data:', error);
      }
    };
    fetchData();
  }, []);

  return { children, ...childData };
};

const isWithinLast = (date: string, days: number): boolean => {
  const dateObj = new Date(date).getTime();
  const now = Date.now();
  return now - dateObj <= days * 24 * 60 * 60 * 1000;
};
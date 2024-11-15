import { useState, useEffect } from 'react';

export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/allPatients');
        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }
        const data = await response.json();
        setPatients(data.child || []); 
      } catch (err) {
        setError('Error fetching patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  },[]); 

  return {
    patients,
    loading,
    error,
  };
};

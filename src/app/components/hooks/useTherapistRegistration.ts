import { useState } from 'react';
import { TherapistRegistrationData, TherapistResponse } from '@/app/utils/types';

interface UseTherapistRegistration {
  registerTherapist: (data: TherapistRegistrationData) => Promise<TherapistResponse>;
  loading: boolean;
  error: string | null;
}

export const useTherapistRegistration = (): UseTherapistRegistration => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerTherapist = async (data: TherapistRegistrationData): Promise<TherapistResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/therapist_registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Registration failed');
      }

      return responseData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { registerTherapist, loading, error };
};

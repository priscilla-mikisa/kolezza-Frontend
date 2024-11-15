export interface Therapist {
  id: number;
  hospital_name: string;
  profile_picture: string | null;
  phone_number: string;
  is_deleted: boolean;
  updated_at: string | null;
  deleted_at: string | null;
}

export const fetchTherapists = async (): Promise<Therapist[]> => {
  try {
    const response = await fetch('/api/therapists');
    if (!response.ok) {
      throw new Error('Failed to fetch therapists data');
    }
    const data = await response.json();
    return data['speech therapists'];
  } catch (error) {
    console.error('Error fetching therapists:', error);
    throw error;
  }
};
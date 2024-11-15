export interface Child {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  gender: string;
  date_of_birth: string;
  is_deleted: boolean;
  updated_at: string | null;
  level_of_stuttering_id: number;
  childmodule_id: number;
}

export const fetchChildren = async (): Promise<Child[]> => {
  try {
    const response = await fetch('/api/children');
    if (!response.ok) {
      throw new Error('Failed to fetch children data');
    }
    const data = await response.json();
    return data['child'];
  } catch (error) {
    console.error('Error fetching children:', error);
    throw error;
  }
};




import { FetchChildrenResponse } from './types';

export const fetchAllChildren = async (): Promise<FetchChildrenResponse> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${process.env.BASE_URL}/api/children`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: FetchChildrenResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching children:', error);
    throw error;
  }
};
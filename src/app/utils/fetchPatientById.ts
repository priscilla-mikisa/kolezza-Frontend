export const fetchUserById = async (id: string) => {
    try {
      const response = await fetch(`/api/user/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
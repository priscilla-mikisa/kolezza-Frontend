export const fetchChildren = async () => {
  try {
    const response = await fetch('/api/user');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

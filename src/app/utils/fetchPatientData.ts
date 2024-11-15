const url = '/api/child/';

const fetchChildData = async (childId: string) => {
  try {
    const response = await fetch(`${url}/${childId}/`);
    

    if (!response.ok) {
      throw new Error(`Error fetching child data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching child data:', error);
    throw error;
  }
};

export default fetchChildData;

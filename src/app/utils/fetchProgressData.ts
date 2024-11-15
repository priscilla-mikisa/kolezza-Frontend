const url = '/api/child-progress'; 

const fetchProgressData = async (childId: string) => {
  try {
    const response = await fetch(`${url}/${childId}/`);

    if (!response.ok) {
      throw new Error(`Error fetching progress data: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      labels: data.time || [],
      values: data.frequency || [],
    };
  } catch (error) {
    console.error('Error fetching progress data:', error);
    throw error;
  }
};

export default fetchProgressData;
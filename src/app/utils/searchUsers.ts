const UseSearchUsers = async (query: string) => {
  try {
    const response = await fetch(`/api/user?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
};

export default UseSearchUsers;

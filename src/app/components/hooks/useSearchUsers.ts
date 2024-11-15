import UseSearchUsers from "@/app/utils/searchUsers";
import { useState } from "react";

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [fetchLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value === "") {
      setSearchResults([]);
      setNotFound(false);
      setError(null);
    }
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await performSearch();
    }
  };

  const performSearch = async () => {
    if (query.length > 2) {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const result = await UseSearchUsers(query);
        if (result.length > 0) {
          setSearchResults(result);
          setNotFound(false);
        } else {
          setSearchResults([]);
          setNotFound(true);
        }
      } catch (err) {
        setError("Error fetching search results");
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
      setNotFound(false);
    }
  };

  return {
    query,
    searchResults,
    fetchLoading,
    error,
    notFound,
    handleInputChange,
    handleKeyPress,
    performSearch,
  };
};
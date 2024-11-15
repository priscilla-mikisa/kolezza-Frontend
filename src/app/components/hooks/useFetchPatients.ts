import { fetchPatients } from "@/app/utils/fetchPatients";
import { FetchedPatient } from "@/app/utils/types";
import { useState, useEffect } from "react";

const useFetchPatients = () => {
  const [patients, setPatients] = useState<FetchedPatient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const getPatients = async () => {
      setLoading(true);
      try {
        const data = await fetchPatients();
        if (Array.isArray(data)) {
          setPatients(data);
        } else {
          setError("Failed to fetch patients");
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "An unknown error has occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    getPatients();
  }, []); 
  return { patients, loading, error };
};

export default useFetchPatients;

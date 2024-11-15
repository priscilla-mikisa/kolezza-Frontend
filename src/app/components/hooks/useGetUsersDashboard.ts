import { fetchUsers } from "@/app/utils/fetchUsers";
import { useState, useEffect } from "react";

type UserRole = "speech_therapist" | "superadmin";

interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  permissions: {
    view_patients: boolean;
    view_progress_reports: boolean;
    view_edit_profile: boolean;
    view_edit_users: boolean;
  };
}

const useGetUsersData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUsersData = async () => {
      try {
        const data = await fetchUsers();

        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data && typeof data === "object") {
          const usersArray = data.users || data.results || Object.values(data);
          if (Array.isArray(usersArray)) {
            setUsers(usersArray);
          } else {
            throw new Error("Unexpected data structure");
          }
        } else {
          throw new Error("Unexpected data type");
        }
      } catch (err) {
        console.error("Error in useGetUsersData:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    getUsersData();
  }),
    [];

  return { users, loading, error };
};

export default useGetUsersData;

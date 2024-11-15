import { useState } from "react";
import { fetchAdmin } from "@/app/utils/adminPost";
import { AdminRegistrationData, AdminRegistrationState, UseAdminRegistrationReturn } from "@/app/utils/types";

export const useAdminRegistration = (): UseAdminRegistrationReturn => {
  const [state, setState] = useState<AdminRegistrationState>({
    loading: false,
    errorMessage: "",
    successMessage: "",
  });

  const registerAdmin = async (data: AdminRegistrationData) => {
    setState((prev) => ({
      ...prev,
      loading: true,
      errorMessage: "",
      successMessage: "",
    }));

    try {
      const result = await fetchAdmin(data);
      console.log({result});
      
      setState((prev) => ({
        ...prev,
        successMessage: "Registration successful!",
      }));
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          setState((prev) => ({
            ...prev,
            errorMessage:
              "Unable to connect to the server. Please check your internet connection and try again.",
          }));
        } else if (error.message.includes("Server configuration error")) {
          setState((prev) => ({
            ...prev,
            errorMessage:
              "There is a problem with the server configuration. Please contact support.",
          }));
        } else {
          setState((prev) => ({
            ...prev,
            errorMessage:
              (error as Error).message ||
              "Registration failed. Please try again.",
          }));
        }
      } else {
        setState((prev) => ({
          ...prev,
          errorMessage: "An unexpected error occurred. Please try again.",
        }));
      }
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return { registerAdmin, ...state };
};

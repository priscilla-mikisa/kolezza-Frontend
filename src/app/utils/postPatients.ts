import {
    PatientRegistrationData,
    RegistrationSuccessResponse,
    RegistrationErrorResponse,
  } from "./types";
  const url = "(admin)/api/add_patient";
  type FetchPatientsFunction = (
    data: PatientRegistrationData
  ) => Promise<RegistrationSuccessResponse>;
  export const fetchPatient: FetchPatientsFunction = async (
    data: PatientRegistrationData
  ) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData:
        | RegistrationSuccessResponse
        | RegistrationErrorResponse = await response.json();
      if (!response.ok) {
        throw new Error(
          (responseData as RegistrationErrorResponse).error ||
            "Registration Failed"
        );
      }
      return responseData as RegistrationSuccessResponse;
    } catch (error) {
      console.error("Error fetching patient:", error);
      throw error;
    }
  };
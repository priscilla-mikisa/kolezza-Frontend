import {
  RegistrationSuccessResponse,
  RegistrationErrorResponse,
  FetchPatientsFunction,
} from "./types";

const fetchPatientsUrl = "/api/get_patients";

export const fetchPatients: FetchPatientsFunction = async () => {
  try {
    const response = await fetch(fetchPatientsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData:
      | RegistrationSuccessResponse
      | RegistrationErrorResponse = await response.json();
    if (!response.ok) {
      throw new Error(
        (responseData as RegistrationErrorResponse).error ||
          "Failed to fetch patients"
      );
    }
    return responseData as RegistrationSuccessResponse;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
};
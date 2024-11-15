import { AdminRegistrationData } from './types';

const url = '/api/create-admin';

export const fetchAdmin = async (data: AdminRegistrationData) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (response.ok && responseData.message === "Successful SignUp") {
            return responseData; 
        } else {
            throw new Error(responseData.error || "Unexpected response format");
        }
    } catch (error) {
        console.error("Error in fetchAdmin:", error);
        return { error: (error as Error).message || "There was an error during sign-up." };
    }
};


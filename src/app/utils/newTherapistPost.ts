import { TherapistRegistrationData } from './types';

const url = '/api/therapist_registration';

export const fetchTherapist = async (data: TherapistRegistrationData) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

   

    if (!response.ok) {
        const errorText = await response.text(); 
    throw new Error(`Error: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();
    return responseData;
};

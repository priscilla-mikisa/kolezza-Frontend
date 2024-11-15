import { LoginCredentials } from "./types";

export const userLogin = async ({ username, password }: LoginCredentials) => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    return response.json();
};


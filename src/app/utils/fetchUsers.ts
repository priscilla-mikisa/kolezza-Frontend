import { User } from "./types";

export const fetchUsers = async () => {
    try {
        const response = await fetch('/api/users');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', (error as Error).message);
        throw error;
    }
};

export const deleteUser = async (id: string) => {
    try {
        const response = await fetch(`/api/user/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

export const updateUser = async (id: string, data: Partial<User>) => {
    try {
        const response = await fetch(`/api/user/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to update user');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

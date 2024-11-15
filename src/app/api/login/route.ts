import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const baseURL = process.env.BASE_URL;

    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${baseURL}/api/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Login failed' },
                { status: response.status }
            );
        }

        // Return user data including role
        return NextResponse.json({
            user: {
                username: data.username,
                role: data.role
            },
            message: 'Login successful'
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
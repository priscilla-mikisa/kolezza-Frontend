import { NextResponse } from 'next/server';
import { TherapistResponse } from '@/app/utils/types';

export async function POST(request: Request) {
    const baseUrl = process.env.BASE_URL;
    
    try {
        const data = await request.json();
        
        if (!data.hospital_name || !data.phone_number || !data.user) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        
        const response = await fetch(`${baseUrl}/api/therapist_registration/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result: TherapistResponse = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: 'Registration failed' }, { status: response.status });
        }

        return NextResponse.json({
            data: {
                user: {
                    username: result.user.username,
                    first_name: result.user.first_name,
                    last_name: result.user.last_name,
                    email: result.user.email,
                    role: result.user.role
                },
                hospital_name: result.hospital_name,
                phone_number: result.phone_number
            },
            message: 'Registration Successful'
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
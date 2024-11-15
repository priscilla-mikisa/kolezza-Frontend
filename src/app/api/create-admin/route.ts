// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//     const baseUrl = process.env.BASE_URL;
//     try {
//         const data = await request.json();
//         const { firstName, lastName, email, username, password } = data;
//         if (!firstName || !lastName || !email || !password || !username) {
//             return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
//         }
//         const response = await fetch(`${baseUrl}/api/create-admin/`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 first_name: firstName,
//                 last_name: lastName,
//                 email,
//                 username,
//                 password
//             })
//         });

//         const result = await response.json();

//         if (!response.ok) {
//             return NextResponse.json({ error: result.detail || 'Registration failed' }, { status: response.status });
//         }

//         return NextResponse.json(result, { status: 201, statusText: "Registration Successful" });
//     } catch (error) {
        
//         return NextResponse.json({ error: (error as Error).message }, { status: 500 });
//     }
// }

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const baseUrl = process.env.BASE_URL;
    
    try {
        const data = await request.json();
        const { firstName, lastName, email, username, password, role } = data;

        // Validate that all required fields are present
        if (!firstName || !lastName || !email || !password || !username || !role) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Make request to create-admin endpoint
        const response = await fetch(`${baseUrl}/api/create-admin/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email,
                username,
                password,
                role
            }),
        });

        const result = await response.json();

        // Check if the response was successful
        if (!response.ok) {
            return NextResponse.json({ error: result.detail || 'Registration failed' }, { status: response.status });
        }

        // Return a consistent success response
        return NextResponse.json({ message: "Successful SignUp",
            user:result
         }, { status: 201 });
        
    } catch (error) {
        // Handle server-side errors
        return NextResponse.json({ error: (error as Error).message || "Internal server error" }, { status: 500 });
    }
}

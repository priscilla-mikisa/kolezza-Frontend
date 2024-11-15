
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

  const baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    console.error('BASE_URL is not defined in environment variables');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const data = await request.json();

    const {
      first_name,
      middle_name,
      last_name,
      gender,
      date_of_birth,
      level_of_stuttering_id,
      childmodule_id
    } = data;

    if (!first_name || !last_name || !gender || !date_of_birth || !level_of_stuttering_id || !childmodule_id) {
      console.log('Missing required fields:', {
        first_name,
        last_name,
        gender,
        date_of_birth,
        level_of_stuttering_id,
        childmodule_id
      });
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    const fullUrl = `${baseUrl}/api/child_registration/`;

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name,
        middle_name,
        last_name,
        date_of_birth,
        gender,
        level_of_stuttering_id,
        childmodule_id
      }),
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      return NextResponse.json(
        { error: 'Registration failed', details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json(result, { status: 201, statusText: 'Registration Successful' });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}
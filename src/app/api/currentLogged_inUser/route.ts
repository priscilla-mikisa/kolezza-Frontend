import { NextResponse } from 'next/server';
const baseURL = process.env.BASE_URL;

export async function GET(request: Request) {
  const token = request.headers.get('Authorization'); 

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized, no token provided' }, { status: 401 });
  }

  try {
    const response = await fetch(`${baseURL}/api/users/me/`, {
      headers: {
        'Authorization': token,  
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      throw new Error('Failed to fetch current user');
    }

    const user = await response.json();
    return NextResponse.json(user);

  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ error: 'Failed to fetch current user' }, { status: 500 });
  }
}

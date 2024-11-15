import { NextResponse } from 'next/server';
const baseURL = process.env.BASE_URL;

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const response = await fetch(`${baseURL}/api/user/${id}/`);
    if (!response.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const user = await response.json();
    return NextResponse.json(user);

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const response = await fetch(`${baseURL}/api/user/${id}/`, { method: 'DELETE' });
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to delete user' }, { status: response.status });
    }
    return NextResponse.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const body = await request.json();
    const response = await fetch(`${baseURL}/api/user/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: response.status });
    }
    const updatedUser = await response.json();
    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
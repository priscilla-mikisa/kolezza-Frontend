const baseUrl = process.env.BASE_URL;

export async function GET(_request: Request, { params: { id } }: { params: { id: string } }) {
  console.log({ id });
  console.log({ baseUrl });

  if (!id) {
    return new Response('child report not found', {
      status: 400, 
    });
  }

  if (!baseUrl) {
    return new Response('Base URL is not configured', {
      status: 500,
    });
  }

  try {
    const res = await fetch(`${baseUrl}/api/api/child-progress/${id}`);  
    if (!res.ok) {
      return new Response(`Error: ${res.statusText}`, {
        status: res.status,
      });
    }

    const result = await res.json();
    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching child progress:', error); 
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}

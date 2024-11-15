export async function GET() {
  const baseUrl = process.env.BASE_URL;

  try {
      const response = await fetch(`${baseUrl}/api/children/`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      const result = await response.json();
      return new Response(JSON.stringify(result), {
          status: 200, 
          statusText: 'Children Fetched Successfully',
      });
  } catch (error) {
      return new Response((error as Error).message, {
          status: 500,
      });
  }
}

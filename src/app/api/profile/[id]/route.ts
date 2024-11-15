export async function GET(_request: Request, { params }: { params: { id: string } }) {
    const { id } = params; 
    console.log({params});

    if (!id) {
        return new Response("User ID is required", { status: 400 });
    }

    const url = `${process.env.BASE_URL}/api/user/${id}/`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return new Response("Failed to fetch user profile", { status: response.status });
        }
        const result = await response.json();
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {

        const errors = (error as Error).message
        console.log({errors});
        
        return new Response((error as Error).message || "Internal server error", { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    console.log("Received userId:", id);

    const profileData = await request.json();
    console.log("Received profileData:", profileData);

    if (!id) {
        return new Response("User ID is required", { status: 400 });
    }

    if (!profileData || Object.keys(profileData).length === 0) {
        return new Response("Profile data is missing or empty", { status: 400 });
    }

    const url = `${process.env.BASE_URL}/api/user/${id}/`;
    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(profileData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return new Response(errorData.message || "Failed to update profile", { status: response.status });
        }

        const updatedProfile = await response.json();
        return new Response(JSON.stringify(updatedProfile), { status: 200 });
    } catch (error) {
        console.error("Error during fetch:", (error as Error).message);
        return new Response((error as Error).message || "Internal server error", { status: 500 });
    }
}

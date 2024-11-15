import { ApiPatient } from "@/app/utils/types";
import { NextResponse } from "next/server";

const baseUrl = process.env.BASE_URL;

export async function GET() {
  try {
    const response = await fetch(`${baseUrl}/api/children/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    const patients: ApiPatient = result.child.map((patient: ApiPatient) => ({
      id: patient.id,
      first_name: patient.first_name,
      middle_name: patient.middle_name,
      last_name: patient.last_name,
      gender: patient.gender,
    }));

    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}

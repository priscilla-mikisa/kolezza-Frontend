"use client";
import React from "react";
import TherapistSidebar from "../TherapistSidebar";

export default function TherapistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white">
        < TherapistSidebar />
      </div>
      <div className="flex-grow p-4">{children}</div>
    </div>
  );
}

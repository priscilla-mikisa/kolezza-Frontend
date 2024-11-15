"use client";
import React from "react";
import Sidebar from "../Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white">
        <Sidebar />
      </div>
      <div className="flex-grow p-4">{children}</div>
    </div>
  );
}

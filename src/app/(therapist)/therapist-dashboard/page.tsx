"use client";

import React, { useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement, // Register PointElement to avoid the error
  CategoryScale,
  LinearScale,
  Tooltip
);

import TherapistLayout from "../TherapistLayout";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, LineElement);

const Dashboard: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string>("Module Two");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get the current date
  const today = new Date();

  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Generate dates for the first week of November and Week 2
  const week1Start = new Date(today.getFullYear(), 10, 1); // November 1st (Month is 0-based)
  const week1End = new Date(today.getFullYear(), 10, 7); // November 7th (End of Week 1)

  const week2Start = new Date(today.getFullYear(), 10, 8); // November 8th
  const week2End = new Date(today.getFullYear(), 10, 14); // November 14th (End of Week 2)

  // Corrected Data for Weekly Active Users (Whole Numbers)
  const wauData = {
    labels: [
      `Week 1 (${formatDate(week1Start)} - ${formatDate(week1End)})`,  // Week 1 date range
      `Week 2 (${formatDate(week2Start)} - ${formatDate(week2End)})`,  // Week 2 date range
      "Week 3", // Placeholder for Week 3
      "Week 4", // Placeholder for Week 4
    ],
    datasets: [
      {
        label: "Weekly Active Users",
        data: [1, 1, 1, 1], // One active user each week (update with actual data as needed)
        borderColor: "#48A14D", // Green color
        backgroundColor: "rgba(72, 161, 77, 0.2)", // Light green background
        fill: true, // Makes the area under the line filled
        tension: 0.3, // Smoother curve
        pointRadius: 5, // Show points on the graph
        pointBackgroundColor: "#48A14D", // Green points
      },
    ],
  };

  const wauOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          // Custom tooltip to show the exact date range on hover
          label: (context: any) => {
            const index = context.dataIndex;
            if (index === 0) {
              return `Active Users: ${context.raw} (${formatDate(week1Start)} - ${formatDate(week1End)})`;
            }
            if (index === 1) {
              return `Active Users: ${context.raw} (${formatDate(week2Start)} - ${formatDate(week2End)})`;
            }
            return `Active Users: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Weeks",
          font: { size: 14, weight: "bold" },
          color: "#333",
        },
      },
      y: {
        title: {
          display: true,
          text: "Active Users",
          font: { size: 14, weight: "bold" },
          color: "#333",
        },
        beginAtZero: true,
        min: 0,  // Start Y-axis from 0
        max: 20, // Max value for Y-axis
        ticks: {
          stepSize: 1,  // Make sure to step in whole numbers
        },
      },
    },
  };

  // Updated Data for Frequency of Use (for each day of the week)
  const frequencyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Frequency of Use",
        data: [3, 4, 2, 5, 3, 0, 1], // Interactions for each day (Mon-Sun)
        backgroundColor: "#FF9F00", // Orange color for bars
        barThickness: 50, // Increased bar thickness for larger bars
      },
    ],
  };

  const frequencyOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Day of the Week",
          font: { size: 14, weight: "bold" },
          color: "#333",
        },
      },
      y: {
        title: {
          display: true,
          text: "Interactions",
          font: { size: 14, weight: "bold" },
          color: "#333",
        },
        beginAtZero: true,
        max: 6, // Set max based on the expected max interactions in a day (e.g., 5 or 6)
      },
    },
  };

  // Sample Data for Fluency Improvement Rate
  const fluencyData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"], // Weeks
    datasets: [
      {
        label: "Fluency Improvement Rate (%)",
        data: [30, 40, 60, 80], // Improvement rate in percentage
        borderColor: "#FF4500", // Red-orange color
        backgroundColor: "rgba(255, 69, 0, 0.2)", // Light red-orange background
        fill: true, // Area filled under the curve
      },
    ],
  };

  const fluencyOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Weeks",
          font: { size: 14, weight: "bold" },
          color: "#333",
        },
      },
      y: {
        title: {
          display: true,
          text: "Improvement (%)",
          font: { size: 14, weight: "bold" },
          color: "#333",
        },
        beginAtZero: true,
        max: 100, 
        ticks: {
          stepSize: 10,  
        },
      },
    },
  };

 
  const speechData = {
    labels: ["Session 1", "Session 2", "Session 3", "Session 4"], 
    datasets: [
      {
        label: "Speech Instances",
        data: [15, 20, 18, 22], 
        backgroundColor: "#32CD32", 
        barThickness: 50, 
      },
    ],
  };

  const speechOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Sessions",
          font: { size: 14, weight: "bold" },
          color: "#333",
        },
      },
      y: {
        title: {
          display: true,
          text: "Speech Instances",
          font: { size: 14, weight: "bold" },
          color: "#333",
        },
        beginAtZero: true,
        max: 30, 
      },
    },
  };

  const sentences = [
    "This is a ball.",
    "This is a cat.",
    "This is a bed.",
    "This is a donkey.",
  ];

 
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <TherapistLayout>
      <div className="flex flex-col items-center min-h-screen bg-white px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard</h1>

       
        <div className="grid grid-cols-3 gap-6 mb-6 w-full max-w-5xl">
          <div className="bg-customDarkBlue text-white p-6 rounded-lg shadow-lg text-center">
            <p className="font-semibold text-3xl">Module One</p>
            <p className="text-lg font-light">Estimated Time: 20–30 seconds</p>
            <p className="text-lg font-light">Total time to complete: 2 minutes</p>
          </div>
          <div className="bg-green-400 p-6 rounded-lg shadow-lg text-center relative">
            <p className="text-3xl font-semibold">Module Two</p>
            <p className="text-lg font-light">Estimated Time: 30–40 seconds</p>
            <p className="text-lg font-light">Total time to complete: 30 minutes</p>
            <button
              className="mt-4 text-sm text-blue-600 underline focus:outline-none"
              onClick={toggleModal} 
            >
              View Sentences
            </button>
          </div>
          <div className="bg-customDarkBlue text-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-3xl font-semibold">Module Three</p>
            <p className="text-lg font-light">Estimated Time: 40 seconds to 1 minute</p>
            <p className="text-lg font-light">Total time to complete: 4 minutes</p>
          </div>
        </div>

        
        <div className="grid grid-cols-1 gap-6 mb-6 w-full max-w-5xl">
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">Number of Patients Using SawaTok</h2>
            <Line data={wauData} options={wauOptions} />
          </div>
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">Daily Patient Interactions with SawaTok</h2>
            <Bar data={frequencyData} options={frequencyOptions} />
          </div>
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">Fluency Improvement Rate</h2>
            <Line data={fluencyData} options={fluencyOptions} />
          </div>
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">The Speech Instances Made by Patients</h2>
            <Bar data={speechData} options={speechOptions} />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Sentences</h3>
            <ul>
              {sentences.map((sentence, index) => (
                <li key={index} className="mb-2">{sentence}</li>
              ))}
            </ul>
            <button
              className="mt-4 text-sm text-blue-600 underline focus:outline-none"
              onClick={toggleModal} // Close the modal when clicked
            >
              Close
            </button>
          </div>
        </div>
      )}
    </TherapistLayout>
  );
};

export default Dashboard;

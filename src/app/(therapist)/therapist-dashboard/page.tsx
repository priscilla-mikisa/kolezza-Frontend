"use client";
import { ChartOptions, TooltipItem } from "chart.js";

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
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip
);

import TherapistLayout from "../TherapistLayout";

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get the current date
  const today = new Date();

  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Generate dates for the first week of November and Week 2
  const week1Start = new Date(today.getFullYear(), 10, 1);
  const week1End = new Date(today.getFullYear(), 10, 7);

  const week2Start = new Date(today.getFullYear(), 10, 8);
  const week2End = new Date(today.getFullYear(), 10, 14);

  const wauData = {
    labels: [
      `Week 1 (${formatDate(week1Start)} - ${formatDate(week1End)})`,
      `Week 2 (${formatDate(week2Start)} - ${formatDate(week2End)})`,
      "Week 3",
      "Week 4",
    ],
    datasets: [
      {
        label: "Weekly Active Users",
        data: [1, 1, 1, 1],
        borderColor: "#48A14D",
        backgroundColor: "rgba(72, 161, 77, 0.2)",
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: "#48A14D",
      },
    ],
  };

  const wauOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"line">) => {
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
          font: { size: 14, weight: "bold" }, // Adjusted font weight to match types
          color: "#333",
        },
      },
      y: {
        title: {
          display: true,
          text: "Active Users",
          font: { size: 14, weight: "bold" }, // Adjusted font weight to match types
          color: "#333",
        },
        beginAtZero: true,
        min: 0,
        max: 20,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const frequencyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Frequency of Use",
        data: [3, 4, 2, 5, 3, 0, 1],
        backgroundColor: "#FF9F00",
        barThickness: 50,
      },
    ],
  };

  const frequencyOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) => {
            return `Frequency: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Day of the Week",
          font: {
            size: 14,
            weight: "bold" as "bold" | "normal" | "bolder" | "lighter", // Explicitly define as valid type
          },
          color: "#333",
        },
      },
      y: {
        title: {
          display: true,
          text: "Interactions",
          font: {
            size: 14,
            weight: "bold" as "bold" | "normal" | "bolder" | "lighter", // Same as above
          },
          color: "#333",
        },
        beginAtZero: true,
        max: 6,
      },
    },
  };
  

  const fluencyData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Fluency Improvement Rate (%)",
        data: [30, 40, 60, 80],
        borderColor: "#FF4500",
        backgroundColor: "rgba(255, 69, 0, 0.2)",
        fill: true,
      },
    ],
  };

  const fluencyOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            return `Improvement: ${context.raw}%`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Weeks",
          font: {
            size: 14,
            weight: "bold" as "bold" | "normal" | "bolder" | "lighter", // Explicitly cast the type
          },
          color: "#333",
        },
      },
      y: {
        title: {
          display: true,
          text: "Improvement (%)",
          font: {
            size: 14,
            weight: "bold" as "bold" | "normal" | "bolder" | "lighter", // Same casting
          },
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
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) => {
            return `Instances: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Sessions",
          font: {
            size: 14,
            weight: "bold" as "bold" | "normal" | "bolder" | "lighter", // Explicitly cast to valid types
          },
          color: "#333",
        },
      },
      y: {
        title: {
          display: true,
          text: "Speech Instances",
          font: {
            size: 14,
            weight: "bold" as "bold" | "normal" | "bolder" | "lighter", // Same explicit cast
          },
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
            <h2 className="text-xl font-semibold mb-4">Speech Instance Accuracy</h2>
            <Bar data={speechData} options={speechOptions} />
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Module Two Sentences</h3>
              <ul className="list-disc pl-5">
                {sentences.map((sentence, index) => (
                  <li key={index} className="mb-2">
                    {sentence}
                  </li>
                ))}
              </ul>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={toggleModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </TherapistLayout>
  );
};

export default Dashboard;

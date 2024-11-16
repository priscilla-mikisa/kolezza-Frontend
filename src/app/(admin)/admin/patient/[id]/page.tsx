// "use client";
// import React, { useEffect, useState } from "react";
// import Layout from "@/app/Layout";
// import PatientDetails from "@/app/components/PatientDetails";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Tooltip,
// } from "chart.js";

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

// interface ProgressData {
//   ts: number;
//   values: {
//     elapsed_time: number;
//   };
// }

// interface WebSocketTimeEntry {
//   data: {
//     elapsed_time?: [number, string][];
//   };
// }

// const DataFilter = {
//   ALL: "all",
//   HISTORICAL: "historical",
//   LIVE: "live",
// } as const;

// type DataFilterType = typeof DataFilter[keyof typeof DataFilter];

// const dataFilterOptions = [
//   { value: DataFilter.ALL, label: "All Data (Default)" },
//   { value: DataFilter.HISTORICAL, label: "Historical Data" },
//   { value: DataFilter.LIVE, label: "Live Data" },
// ];

// const PatientPage = ({ params }: { params: { id: string } }) => {
//   const { id } = params;
//   const [progressData, setProgressData] = useState<ProgressData[]>([]);
//   const [historicalData, setHistoricalData] = useState<ProgressData[]>([]);
//   const [liveData, setLiveData] = useState<ProgressData[]>([]);
//   const [dataFilter, setDataFilter] = useState<DataFilterType>(DataFilter.ALL);
//   const [isDeviceConnected] = useState<boolean>(id === "2");

//   const websocketRef = React.useRef<WebSocket | null>(null);

//   // Dummy historical data (based on your database screenshot)
//   useEffect(() => {
//     const dummyHistoricalData: ProgressData[] = [
//       { ts: 1731484855119, values: { elapsed_time: 2.83 } },
//       { ts: 1731484755119, values: { elapsed_time: 2.83 } },
//       { ts: 1731484655119, values: { elapsed_time: 2.83 } },
//       { ts: 1731562898389, values: { elapsed_time: 2.51 } },
//       { ts: 1731563944687, values: { elapsed_time: 3.45 } },
//     ];
//     setHistoricalData(dummyHistoricalData);
//     setProgressData(dummyHistoricalData); // Start with historical data
//   }, []);

//   // WebSocket for live data
//   useEffect(() => {
//     if (!isDeviceConnected) return;

//     const websocket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL!);
//     websocketRef.current = websocket;

//     websocket.onopen = () => {
//       console.log("WebSocket connection established for live data.");
//       websocket.send(
//         JSON.stringify({
//           authCmd: {
//             cmdId: 0,
//             token: process.env.NEXT_PUBLIC_THINGSBOARD_TOKEN,
//           },
//           cmds: [
//             {
//               entityType: "DEVICE",
//               entityId: process.env.NEXT_PUBLIC_ENTITY_ID,
//               scope: "LATEST_TELEMETRY",
//               cmdId: 10,
//               type: "TIMESERIES",
//             },
//           ],
//         })
//       );
//     };

//     websocket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log("WebSocket data received:", data);

//       if (data.data && data.data.elapsed_time) {
//         const parsedData = data as WebSocketTimeEntry;
//         const newLiveData = parsedData.data.elapsed_time?.map((entry) => ({
//           ts: entry[0],
//           values: {
//             elapsed_time: parseFloat(entry[1]),
//           },
//         })) || [];

//         setLiveData((prevData) => [...prevData, ...newLiveData]);
//       }
//     };

//     websocket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     websocket.onclose = () => {
//       console.log("WebSocket connection closed.");
//     };

//     return () => {
//       websocket.close();
//     };
//   }, [isDeviceConnected]);

//   // Combine and filter data
//   useEffect(() => {
//     let combinedData: ProgressData[] = [];
//     if (dataFilter === DataFilter.ALL) {
//       combinedData = [...historicalData, ...liveData];
//     } else if (dataFilter === DataFilter.HISTORICAL) {
//       combinedData = historicalData;
//     } else if (dataFilter === DataFilter.LIVE) {
//       combinedData = liveData;
//     }
//     setProgressData(combinedData);
//   }, [dataFilter, historicalData, liveData]);

//   const chartData = {
//     labels: progressData.map((entry) =>
//       new Date(entry.ts).toLocaleString("en-US", { hour: "numeric", minute: "numeric", second: "numeric" })
//     ),
//     datasets: [
//       {
//         label: "Elapsed Time (s)",
//         data: progressData.map((entry) => entry.values.elapsed_time),
//         borderColor: "rgba(75, 192, 192, 1)",
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         fill: true,
//         tension: 0.3,
//         borderWidth: 2,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     scales: {
//       x: { title: { display: true, text: "Timestamp", font: { size: 16 } } },
//       y: { title: { display: true, text: "Elapsed Time (seconds)", font: { size: 16 } } },
//     },
//   };

//   if (!isDeviceConnected) {
//     return (
//       <Layout>
//         <div className="flex flex-col items-center justify-center h-screen">
//           <h1 className="text-xl text-gray-500">This child is not connected to any device yet.</h1>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="flex flex-col items-center pb-6">
//         <div className="w-full mb-8">
//           <PatientDetails childId={id} />
//         </div>
//         <h1 className="text-[2rem] mb-2">Progress Of A Child Overtime</h1>
//         <div className="flex justify-center w-full">
//           <div className="w-full max-w-7xl px-4">
//             <div className="mb-6 relative">
//               <select
//                 value={dataFilter}
//                 onChange={(e) => setDataFilter(e.target.value as DataFilterType)}
//                 className="w-56 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
//               >
//                 {dataFilterOptions.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="h-[500px] bg-white p-4 rounded-lg shadow">
//               <Line data={chartData} options={chartOptions} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default PatientPage;



// "use client";
// import React, { useEffect, useState } from "react";
// import Layout from "@/app/Layout";
// import PatientDetails from "@/app/components/PatientDetails";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Tooltip,
// } from "chart.js";

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

// interface ProgressData {
//   ts: number;
//   values: {
//     elapsed_time: number;
//   };
// }

// interface WebSocketTimeEntry {
//   data: {
//     elapsed_time?: [number, string][];
//   };
// }

// const DataFilter = {
//   ALL: "all",
//   HISTORICAL: "historical",
//   LIVE: "live",
// } as const;

// type DataFilterType = typeof DataFilter[keyof typeof DataFilter];

// const dataFilterOptions = [
//   { value: DataFilter.ALL, label: "All Data (Default)" },
//   { value: DataFilter.HISTORICAL, label: "Historical Data" },
//   { value: DataFilter.LIVE, label: "Live Data" },
// ];

// const PatientPage = ({ params }: { params: { id: string } }) => {
//   const { id } = params;
//   const [progressData, setProgressData] = useState<ProgressData[]>([]);
//   const [historicalData, setHistoricalData] = useState<ProgressData[]>([]);
//   const [liveData, setLiveData] = useState<ProgressData[]>([]);
//   const [dataFilter, setDataFilter] = useState<DataFilterType>(DataFilter.ALL);
//   const [isDeviceConnected] = useState<boolean>(id === "2");

//   const websocketRef = React.useRef<WebSocket | null>(null);

//   // Dummy historical data (based on your database screenshot)
//   useEffect(() => {
//     const dummyHistoricalData: ProgressData[] = [
//       { ts: 1731484855119, values: { elapsed_time: 2.83 } },
//       { ts: 1731484755119, values: { elapsed_time: 2.83 } },
//       { ts: 1731484655119, values: { elapsed_time: 2.83 } },
//       { ts: 1731562898389, values: { elapsed_time: 2.51 } },
//       { ts: 1731563944687, values: { elapsed_time: 3.45 } },
//     ];
//     setHistoricalData(dummyHistoricalData);
//     setProgressData(dummyHistoricalData); // Start with historical data
//   }, []);

//   // WebSocket for live data
//   useEffect(() => {
//     if (!isDeviceConnected) return;

//     const websocket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL!);
//     websocketRef.current = websocket;

//     websocket.onopen = () => {
//       console.log("WebSocket connection established for live data.");
//       websocket.send(
//         JSON.stringify({
//           authCmd: {
//             cmdId: 0,
//             token: process.env.NEXT_PUBLIC_THINGSBOARD_TOKEN,
//           },
//           cmds: [
//             {
//               entityType: "DEVICE",
//               entityId: process.env.NEXT_PUBLIC_ENTITY_ID,
//               scope: "LATEST_TELEMETRY",
//               cmdId: 10,
//               type: "TIMESERIES",
//             },
//           ],
//         })
//       );
//     };

//     websocket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log("WebSocket data received:", data);

//       if (data.data && data.data.elapsed_time) {
//         const parsedData = data as WebSocketTimeEntry;
//         const newLiveData = parsedData.data.elapsed_time?.map((entry) => ({
//           ts: entry[0],
//           values: {
//             elapsed_time: parseFloat(entry[1]),
//           },
//         })) || [];

//         setLiveData((prevData) => [...prevData, ...newLiveData]);
//       }
//     };

//     websocket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     websocket.onclose = () => {
//       console.log("WebSocket connection closed.");
//     };

//     return () => {
//       websocket.close();
//     };
//   }, [isDeviceConnected]);

//   // Combine and filter data
//   useEffect(() => {
//     let combinedData: ProgressData[] = [];
//     if (dataFilter === DataFilter.ALL) {
//       combinedData = [...historicalData, ...liveData];
//     } else if (dataFilter === DataFilter.HISTORICAL) {
//       combinedData = historicalData;
//     } else if (dataFilter === DataFilter.LIVE) {
//       combinedData = liveData;
//     }
//     setProgressData(combinedData);
//   }, [dataFilter, historicalData, liveData]);

//   const chartData = {
//     labels: progressData.map((entry) =>
//       new Date(entry.ts).toLocaleString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         hour: 'numeric',
//         minute: 'numeric',
//         hour12: true
//       })
//     ),
//     datasets: [
//       {
//         label: "Elapsed Time (s)",
//         data: progressData.map((entry) => entry.values.elapsed_time),
//         borderColor: "rgba(75, 192, 192, 1)",
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         fill: true,
//         tension: 0.3,
//         borderWidth: 2,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     scales: {
//       x: {
//         title: { display: true, text: "Timestamp", font: { size: 16 } },
//         ticks: {
//           maxRotation: 45,
//           minRotation: 45
//         }
//       },
//       y: { 
//         title: { display: true, text: "Elapsed Time (seconds)", font: { size: 16 } }
//       },
//     },
//   };

//   if (!isDeviceConnected) {
//     return (
//       <Layout>
//         <div className="flex flex-col items-center justify-center h-screen">
//           <h1 className="text-xl text-gray-500">This child is not connected to any device yet.</h1>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="flex flex-col items-center pb-6">
//         <div className="w-full mb-8">
//           <PatientDetails childId={id} />
//         </div>
//         <h1 className="text-[2rem] mb-2">Progress Of A Child Overtime</h1>
//         <div className="flex justify-center w-full">
//           <div className="w-full max-w-7xl px-4">
//             <div className="mb-6 relative">
//               <select
//                 value={dataFilter}
//                 onChange={(e) => setDataFilter(e.target.value as DataFilterType)}
//                 className="w-56 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
//               >
//                 {dataFilterOptions.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="h-[500px] bg-white p-4 rounded-lg shadow">
//               <Line data={chartData} options={chartOptions} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default PatientPage;


"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/app/Layout";
import PatientDetails from "@/app/components/PatientDetails";
import { Line } from "react-chartjs-2"; // Import Line chart from react-chartjs-2
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement, // Ensure PointElement is registered
  Tooltip,
} from "chart.js";

// Register the required components (including PointElement)
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

interface ProgressData {
  ts: number;
  values: {
    elapsed_time: number;
  };
}

const DataFilter = {
  ALL: "all",
  HISTORICAL: "historical",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
} as const;

type DataFilterType = typeof DataFilter[keyof typeof DataFilter];

const dataFilterOptions = [
  { value: DataFilter.ALL, label: "All Data (Default)" },
  // { value: DataFilter.HISTORICAL, label: "Historical Data" },
  { value: DataFilter.WEEKLY, label: "Last Week" },
];

const PatientPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [historicalData, setHistoricalData] = useState<ProgressData[]>([]);
  const [dataFilter, setDataFilter] = useState<DataFilterType>(DataFilter.ALL);

  // Dummy historical data with added data for 15th November
  useEffect(() => {
    const dummyHistoricalData: ProgressData[] = [
      { ts: 1731484855119, values: { elapsed_time: 2.83 } },
      { ts: 1731484755119, values: { elapsed_time: 2.83 } },
      { ts: 1731484655119, values: { elapsed_time: 2.83 } },
      { ts: 1731562898389, values: { elapsed_time: 2.51 } },
      { ts: 1731563944687, values: { elapsed_time: 3.45 } },
      // Data for November 15th (Added)
      { ts: new Date("2024-11-15T10:00:00Z").getTime(), values: { elapsed_time: 4.5 } }, // 4.5 minutes
    ];
    setHistoricalData(dummyHistoricalData);
  }, []);

  // Filter data based on selected filter option (Weekly, Monthly, etc.)
  useEffect(() => {
    let filteredData = [...historicalData];

    if (dataFilter === DataFilter.WEEKLY) {
      // Filter data for the last week
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      filteredData = historicalData.filter((entry) => entry.ts >= oneWeekAgo);
    } else if (dataFilter === DataFilter.MONTHLY) {
      // Filter data for the last month
      const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
      filteredData = historicalData.filter((entry) => entry.ts >= oneMonthAgo);
    }

    setProgressData(filteredData);
  }, [dataFilter, historicalData]);

  const chartData = {
    labels: progressData.map((entry) =>
      new Date(entry.ts).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    ),
    datasets: [
      {
        label: "Elapsed Time (minutes)", // Change label to minutes
        data: progressData.map((entry) => entry.values.elapsed_time * 10), // Scale the elapsed_time to make it more reasonable
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        borderWidth: 2,
        tension: 0.3, // Makes the line curve a bit
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: "Date", font: { size: 16 } },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: { display: true, text: "Elapsed Time (minutes)", font: { size: 16 } },
        beginAtZero: true, // Ensure the Y-axis starts at 0
      },
    },
  };

  return (
    <Layout>
      <div className="flex flex-col items-center pb-6">
        <div className="w-full mb-8">
          <PatientDetails childId={id} />
        </div>
        <h1 className="text-[2rem] mb-2">Analysis of Engagement Frequency for SawaTok </h1>
        <div className="flex justify-center w-full">
          <div className="w-full max-w-7xl px-4">
            <div className="mb-6 relative">
              <select
                value={dataFilter}
                onChange={(e) => setDataFilter(e.target.value as DataFilterType)}
                className="w-56 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
              >
                {dataFilterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="h-[500px] bg-white p-4 rounded-lg shadow">
              {/* Line chart rendering */}
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientPage;

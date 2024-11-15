"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/app/Layout";
import PatientDetails from "@/app/components/PatientDetails";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

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
  LIVE: "live",
} as const;

type DataFilterType = typeof DataFilter[keyof typeof DataFilter];

const dataFilterOptions = [
  { value: DataFilter.ALL, label: "All Data (Default)" },
  { value: DataFilter.HISTORICAL, label: "Historical Data" },
  { value: DataFilter.LIVE, label: "Live Data" },
];

const PatientPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [historicalData, setHistoricalData] = useState<ProgressData[]>([]);
  const [liveData, setLiveData] = useState<ProgressData[]>([]);
  const [dataFilter, setDataFilter] = useState<DataFilterType>(DataFilter.ALL);
  const [isDeviceConnected, setIsDeviceConnected] = useState<boolean>(id === "2");

  const websocketRef = React.useRef<WebSocket | null>(null);

  // Dummy historical data (based on your database screenshot)
  useEffect(() => {
    const dummyHistoricalData: ProgressData[] = [
      { ts: 1731484855119, values: { elapsed_time: 2.83 } },
      { ts: 1731484755119, values: { elapsed_time: 2.83 } },
      { ts: 1731484655119, values: { elapsed_time: 2.83 } },
      { ts: 1731562898389, values: { elapsed_time: 2.51 } },
      { ts: 1731563944687, values: { elapsed_time: 3.45 } },
    ];
    setHistoricalData(dummyHistoricalData);
    setProgressData(dummyHistoricalData); // Start with historical data
  }, []);

  // WebSocket for live data
  useEffect(() => {
    if (!isDeviceConnected) return;

    const websocket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL!);
    websocketRef.current = websocket;

    websocket.onopen = () => {
      console.log("WebSocket connection established for live data.");
      websocket.send(
        JSON.stringify({
          authCmd: {
            cmdId: 0,
            token: process.env.NEXT_PUBLIC_THINGSBOARD_TOKEN,
          },
          cmds: [
            {
              entityType: "DEVICE",
              entityId: process.env.NEXT_PUBLIC_ENTITY_ID,
              scope: "LATEST_TELEMETRY",
              cmdId: 10,
              type: "TIMESERIES",
            },
          ],
        })
      );
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket data received:", data);

      if (data.data && data.data.elapsed_time) {
        const newLiveData = data.data.elapsed_time.map((entry: any) => ({
          ts: entry[0],
          values: {
            elapsed_time: parseFloat(entry[1]),
          },
        }));

        setLiveData((prevData) => [...prevData, ...newLiveData]);
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      websocket.close();
    };
  }, [isDeviceConnected]);

  // Combine and filter data
  useEffect(() => {
    let combinedData: ProgressData[] = [];
    if (dataFilter === DataFilter.ALL) {
      combinedData = [...historicalData, ...liveData];
    } else if (dataFilter === DataFilter.HISTORICAL) {
      combinedData = historicalData;
    } else if (dataFilter === DataFilter.LIVE) {
      combinedData = liveData;
    }
    setProgressData(combinedData);
  }, [dataFilter, historicalData, liveData]);

  const chartData = {
    labels: progressData.map((entry) =>
      new Date(entry.ts).toLocaleString("en-US", { hour: "numeric", minute: "numeric", second: "numeric" })
    ),
    datasets: [
      {
        label: "Elapsed Time (s)",
        data: progressData.map((entry) => entry.values.elapsed_time),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.3,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Timestamp", font: { size: 16 } } },
      y: { title: { display: true, text: "Elapsed Time (seconds)", font: { size: 16 } } },
    },
  };

  if (!isDeviceConnected) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-xl text-gray-500">This child is not connected to any device yet.</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center pb-6">
        <div className="w-full mb-8">
          <PatientDetails childId={id} />
        </div>
        <h1 className="text-[2rem] mb-2">Progress Of A Child Overtime</h1>
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
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientPage;



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

// const PatientPage = ({ params }: { params: { id: string } }) => {
//   const { id } = params;
//   const [progressData, setProgressData] = useState<ProgressData[]>([]);
//   const [historicalData, setHistoricalData] = useState<ProgressData[]>([]);
//   const [isDeviceConnected, setIsDeviceConnected] = useState<boolean>(id === "2");
//   const [isThingsboardActive, setIsThingsboardActive] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   // WebSocket instance
//   const websocketRef = React.useRef<WebSocket | null>(null);

//   // Fetch historical data from the database
//   useEffect(() => {
//     if (!isDeviceConnected) return;

//     const fetchHistoricalData = async () => {
//       try {
//         setIsLoading(true);
//         const websocket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL!);
//         websocketRef.current = websocket;

//         websocket.onopen = () => {
//           console.log("WebSocket connected to fetch historical data");

//           websocket.send(
//             JSON.stringify({
//               type: "FETCH_HISTORICAL",
//               limit: 10, // Fetch last 10 entries
//             })
//           );
//         };

//         websocket.onmessage = (event) => {
//           const data = JSON.parse(event.data);
//           console.log("Historical data received:", data);

//           if (data.type === "HISTORICAL_DATA") {
//             const historicalEntries = data.data.map((item: any) => ({
//               ts: parseInt(item.timestamp),
//               values: { elapsed_time: parseFloat(item.value) },
//             }));
//             setHistoricalData(historicalEntries);
//             setProgressData(historicalEntries); // Display historical data initially
//           }

//           setIsLoading(false);
//         };

//         websocket.onerror = (error) => {
//           console.error("Error fetching historical data:", error);
//           setIsLoading(false);
//         };

//         websocket.onclose = () => {
//           console.log("WebSocket for historical data closed");
//         };
//       } catch (error) {
//         console.error("Error fetching historical data:", error);
//         setIsLoading(false);
//       }
//     };

//     fetchHistoricalData();
//   }, [isDeviceConnected]);

//   // Subscribe to live data
//   useEffect(() => {
//     if (!isDeviceConnected) return;

//     const websocket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL!);
//     websocketRef.current = websocket;

//     websocket.onopen = () => {
//       console.log("WebSocket connected to subscribe to live data");

//       websocket.send(
//         JSON.stringify({
//           type: "SUBSCRIBE_LIVE",
//         })
//       );
//     };

//     websocket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log("Live data received:", data);

//       if (data.type === "LIVE_DATA") {
//         setIsThingsboardActive(true);

//         const newLiveData = data.data.map((entry: any) => ({
//           ts: entry.timestamp,
//           values: { elapsed_time: parseFloat(entry.value) },
//         }));

//         setProgressData((prevData) => [...prevData, ...newLiveData]);
//       }
//     };

//     websocket.onerror = (error) => {
//       console.error("WebSocket error for live data:", error);
//     };

//     websocket.onclose = () => {
//       console.log("WebSocket for live data closed");
//       setIsThingsboardActive(false); // Mark ThingsBoard as inactive
//     };

//     return () => websocket.close();
//   }, [isDeviceConnected]);

//   const chartData = {
//     labels: progressData.map((entry) => new Date(entry.ts).toLocaleString()),
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

//   if (isLoading) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center h-screen">
//           <h1 className="text-xl text-gray-500">Loading data...</h1>
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
//         {isDeviceConnected ? (
//           <>
//             <h1 className="text-[2rem] mb-2">Progress Of A Child Overtime</h1>
//             <div className="flex justify-center w-full">
//               <div className="w-full max-w-7xl px-4">
//                 {!isThingsboardActive && (
//                   <p className="text-gray-500 text-center mb-4">
//                     ThingsBoard is currently inactive. Displaying historical data only.
//                   </p>
//                 )}
//                 <div className="h-[500px] bg-white p-4 rounded-lg shadow">
//                   <Line data={chartData} options={chartOptions} />
//                 </div>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="text-center">
//             <h1 className="text-xl mb-4">Child is not connected to any device yet.</h1>
//           </div>
//         )}
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
//     expected_text: string;
//     recognized_text: string;
//     correct: boolean;
//     stars_earned: number;
//     elapsed_time: number;
//   };
// }
// const TimeFilter = {
//   DAILY: "daily",
//   WEEKLY: "weekly",
//   MONTHLY: "monthly",
// } as const;

// type TimeFilterType = typeof TimeFilter[keyof typeof TimeFilter];

// const timeFilterOptions = [
//   { value: TimeFilter.DAILY, label: "Daily Average" },
//   { value: TimeFilter.WEEKLY, label: "Weekly Average" },
//   { value: TimeFilter.MONTHLY, label: "Monthly Average" },
// ];
// const PatientPage = ({ params }: { params: { id: string } }) => {
//   const { id } = params;
//   const [progressData, setProgressData] = useState<ProgressData[]>([]);
//   const [timeFilter, setTimeFilter] = useState<TimeFilterType>(TimeFilter.DAILY);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   useEffect(() => {
//     if (id === "2") {
//       const childData: ProgressData[] = [
//         {
//           ts: new Date('2024-10-17T09:00:00').getTime(),
//           values: { expected_text: "This is a ball", recognized_text: "This is a ball", correct: true, stars_earned: 1, elapsed_time: 1.2 },
//         },
//         {
//           ts: new Date('2024-10-18T09:00:00').getTime(),
//           values: { expected_text: "This is a cat", recognized_text: "This is a cat", correct: true, stars_earned: 1, elapsed_time: 2.5 },
//         },
//         {
//           ts: new Date('2024-10-19T09:00:00').getTime(),
//           values: { expected_text: "This is a bed", recognized_text: "This is a dog", correct: false, stars_earned: 0, elapsed_time: 3.0 },
//         },
//         {
//           ts: new Date('2024-10-20T09:00:00').getTime(),
//           values: { expected_text: "This is a donkey", recognized_text: "This is a donkey", correct: true, stars_earned: 1, elapsed_time: 1.8 },
//         },
//         {
//           ts: new Date('2024-10-21T09:00:00').getTime(),
//           values: { expected_text: "This is a car", recognized_text: "This is a car", correct: true, stars_earned: 2, elapsed_time: 2.0 },
//         },
//         {
//           ts: new Date('2024-10-22T09:00:00').getTime(),
//           values: { expected_text: "This is an apple", recognized_text: "This is an orange", correct: false, stars_earned: 0, elapsed_time: 4.5 },
//         },
//         {
//           ts: new Date('2024-10-23T09:00:00').getTime(),
//           values:{ expected_text:"This is a tree", recognized_text:"This is a tree", correct:true , stars_earned :1 , elapsed_time :1.5},
//         },
//         {
//           ts:new Date('2024-10-24T09 :00 :00').getTime(),
//           values:{ expected_text:"This is a house", recognized_text:"This is a house", correct:true , stars_earned :3 , elapsed_time :2.8},
//         },
//         {
//           ts:new Date('2024-10-25T09 :00 :00').getTime(),
//           values:{ expected_text:"This is a fish", recognized_text:"This is a bird", correct:false , stars_earned :0 , elapsed_time :3.3},
//         },
//         {
//           ts:new Date('2024-10-26T09 :00 :00').getTime(),
//           values:{ expected_text:"This is a bicycle", recognized_text:"This is a bicycle", correct:true , stars_earned :1 , elapsed_time :2.1},
//         },
//         {
//           ts:new Date('2024-10-27T09 :00 :00').getTime(),
//           values:{ expected_text:"This is a laptop", recognized_text:"This is a laptop", correct:true , stars_earned :1 , elapsed_time :2.4},
//         },
//         {
//           ts:new Date('2024-10-28T09 :00 :00').getTime(),
//           values:{ expected_text:"This is a phone", recognized_text:"This is a phone", correct:true , stars_earned :2 , elapsed_time :1.9},
//         },
//         {
//           ts:new Date('2024-10-29T09 :00 :00').getTime(),
//           values:{ expected_text:"This is a tablet", recognized_text:"This is a book", correct:false , stars_earned :0 , elapsed_time :3.8},
//         },
//         {
//           ts:new Date('2024-10-30T09 :00 :00').getTime(),
//           values:{ expected_text:"This is a shirt", recognized_text:"This is a shirt", correct:true , stars_earned :2 , elapsed_time :2.7},
//         },
//         {
//           ts:new Date('2024-10-31T09 :00 :00').getTime(),
//           values:{ expected_text:"This is a cup", recognized_text:"This is a mug", correct:false , stars_earned :0 , elapsed_time :3.1},
//         },
//         {
//           ts:new Date('2024-11-01T09 :00 :00').getTime(),
//           values:{ expected_text:"This is a watch", recognized_text:"This is a clock", correct:false , stars_earned :0 , elapsed_time :4.0},
//         },
//         {
//           ts:new Date('2024-11-02T09 :00 :00').getTime(),
//           values:{ expected_text:"This is a mouse", recognized_text:"This is a mouse", correct:true , stars_earned :1 , elapsed_time :1.5},
//         },
//         {
//           ts:new Date('2024-11-03T09 :00 :00').getTime(),
//           values:{ expected_text:"This is a keyboard", recognized_text:"This is a keyboard", correct:true , stars_earned :2 , elapsed_time :1.6},
//         },
//         {
//           ts:new Date('2024-11-04T09 :00 :00').getTime(),
//           values:{ expected_text:"This is a sofa", recognized_text:"This is a couch", correct:false , stars_earned :0 , elapsed_time :3.2},
//         }
//       ];
//       setProgressData(childData);
//     }
//   }, [id]);

//   const processData = (data: ProgressData[], filter: TimeFilterType) => {
//     const grouped = new Map();
//     const startOfOctober = new Date('2024-10-17').getTime(); // Starting point for filtering

//     data.forEach((entry) => {
//       const date = new Date(entry.ts);
      
//       if (date.getTime() < startOfOctober) return; 

//       let key;

//       switch (filter) {
//         case TimeFilter.DAILY:
//           key = date.toLocaleDateString('en-US', { month:'short', day:'numeric' });
//           break;
//         case TimeFilter.WEEKLY:
//           const startOfWeek = new Date(date);
//           startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Start from Monday
          
//            // Calculate week number
//            const weekNumber = Math.ceil((startOfWeek.getDate() -1) /7);
//            key = `Week ${weekNumber} of October`;
//            break;
//          case TimeFilter.MONTHLY:
//            key = date.toLocaleDateString('en-US', { month:'long', year:'numeric' });
//            break;
//        }
//        if (!grouped.has(key)) grouped.set(key,{ totalTime :0 , count :0 });
//        const current = grouped.get(key);
//        current.totalTime += entry.values.elapsed_time;
//        current.count +=1;
//     });

//     const sortedKeys = Array.from(grouped.keys()).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());
    
//     const averageData = sortedKeys.map(key => {
//       const { totalTime , count } = grouped.get(key);
//       return Number((totalTime / count).toFixed(2));
//     });

//     return { labels :sortedKeys , data :averageData };
//    };

//    if (!progressData.length) return <div className="flex justify-center items-center h-screen">Loading...</div>;

//    const { labels , data } = processData(progressData , timeFilter);

//    const chartData = {
//     labels,
//     datasets: [{
//       label: "Elapsed Time (s)",
//       data,
//       borderColor: "rgba(75, 192, 192, 1)",
//       backgroundColor: "rgba(75, 192, 192, 0.2)",
//       fill: true,
//       tension: 0.3,
//       borderWidth: 2,
//     }],
//   };
//   const chartOptions = {
//     responsive: true,
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: "Date",
//           font: { size: 16 },
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: "Elapsed Time (seconds)",
//           font: { size: 16 },
//         },
//       },
//     },
//   };

//   return (
//     <Layout>
//       <div className="flex flex-col items-center  pb-6">
//         <div className="w-full mb-8">
//           <PatientDetails childId={id} />
//         </div>
//         <h1 className="text-[2rem] mb-2">Progress Of A Child Overtime</h1>
//         <div className="flex justify-center w-full">
//           {id === "2" ? (
//             <div className="w-full max-w-7xl px-4">
//               <div className="mb-6 relative">
//                 <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-56 px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
//                   <div className="flex items-center justify-between">
//                     <span className="text-lg">{timeFilterOptions.find(opt => opt.value === timeFilter)?.label}</span>
//                     <svg
//                       className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </button>
//                 {isDropdownOpen && (
//                   <div className="absolute z-10 w-48 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
//                     {timeFilterOptions.map((option) => (
//                       <button
//                         key={option.value}
//                         onClick={() => {
//                           setTimeFilter(option.value);
//                           setIsDropdownOpen(false);
//                         }}
//                         className={`block w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none ${
//                           timeFilter === option.value ? 'bg-gray-100' : ''
//                         }`}
//                       >
//                         {option.label}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <div className="h-[500px] bg-white p-4 rounded-lg shadow">
//                 <Line data={chartData} options={chartOptions} />
//               </div>
//             </div>
//           ) : (
//             <div className="text-center text-gray-500">
//               Only user ID 2 has ThingsBoard integration enabled.
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default PatientPage;









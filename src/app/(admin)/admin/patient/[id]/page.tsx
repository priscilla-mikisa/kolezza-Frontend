
"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/app/Layout";
import PatientDetails from "@/app/components/PatientDetails";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
  Legend
);

interface TelemetryData {
  ts: number;
  value: string | number;
}

interface BackendData {
  elapsed_time: TelemetryData[];
  expected_text: TelemetryData[];
}

interface ProgressData {
  ts: number;
  values: {
    elapsed_time: number;
  };
}

const DataFilter = {
  NOVEMBER: "november",
  LAST_MONTH: "last_month",
} as const;

type DataFilterType = typeof DataFilter[keyof typeof DataFilter];

const dataFilterOptions = [
  { value: DataFilter.NOVEMBER, label: "November Data" },
  { value: DataFilter.LAST_MONTH, label: "Last Month (October)" },
];

const ViewOptions = {
  WORD_FREQUENCY: "word_frequency",
  MODULE_COMPLETION: "module_completion",
} as const;

type ViewOptionType = typeof ViewOptions[keyof typeof ViewOptions];

const PatientPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [viewOption, setViewOption] = useState<ViewOptionType>(ViewOptions.MODULE_COMPLETION);
  const [backendData, setBackendData] = useState<BackendData | null>(null);
  const [filteredData, setFilteredData] = useState<Record<string, TelemetryData[]>>({});
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [historicalData, setHistoricalData] = useState<ProgressData[]>([]);
  const [dataFilter, setDataFilter] = useState<DataFilterType>(DataFilter.NOVEMBER);

  // Mock fetching backend data with added hard-coded data
  useEffect(() => {
    const now = new Date();
    const createTimestamp = (day: number) => {
      return new Date(2024, 10, day, 2, 0, 0).getTime();
    };

    const isCurrentOrFutureDate = (day: number) => {
      const currentDate = new Date();
      const targetDate = new Date(2024, 10, day);
      return targetDate >= currentDate;
    };

    const generateValue = (baseValue: number) => {
      return baseValue + (Math.random() * 2 - 1); // Adds variation of ±1 second
    };

    const mockData: BackendData = {
      elapsed_time: [
        { ts: 1731681523851, value: 3.9 },
        { ts: 1731914975061, value: 4.5 },
      ],
      expected_text: [
        { ts: 1731914975061, value: "This is a ball" },
        { ts: 1731914975062, value: "This is a cat" },
        { ts: 1731914975063, value: "This is a bed" },
        { ts: 1731914975064, value: "This is a donkey" },
      ],
    };

    // Define base values for each word
    const wordData = {
      ball: 3.5,
      cat: 4.2,
      bed: 3.8,
      donkey: 4.7,
    };

    // Generate data for days 16-20
    [16, 17, 18, 19, 20].forEach(day => {
      if (!isCurrentOrFutureDate(day)) {
        // Past data
        Object.entries(wordData).forEach(([word, baseTime]) => {
          const ts = createTimestamp(day);
          mockData.elapsed_time.push({ ts, value: generateValue(baseTime) });
          mockData.expected_text.push({ ts, value: `This is a ${word}` });
        });
      }
    });

    // Add real-time updates for current and future dates
    if (now.getDate() === 19 || now.getDate() === 20) {
      const currentTime = now.getTime();
      Object.entries(wordData).forEach(([word, baseTime]) => {
        mockData.elapsed_time.push({ ts: currentTime, value: generateValue(baseTime) });
        mockData.expected_text.push({ ts: currentTime, value: `This is a ${word}` });
      });
    }

    setBackendData(mockData);
  }, []); // Empty dependency array for initial load

  // Filter word frequency data
  useEffect(() => {
    if (backendData) {
      const groupedData: Record<string, TelemetryData[]> = {};
      backendData.expected_text.forEach(({ ts, value }) => {
        const word = value.toString().split(" ").pop()?.toLowerCase(); // Extract last word
        if (word) {
          const elapsedTime = backendData.elapsed_time.find((e) => e.ts === ts);
          if (!groupedData[word]) groupedData[word] = [];
          if (elapsedTime) groupedData[word].push({ ts, value: elapsedTime.value });
        }
      });
      setFilteredData(groupedData);
    }
  }, [backendData]);

  // Generate historical data
  const generateHistoricalData = () => {
    const data: ProgressData[] = [];
    for (let day = 1; day <= 31; day++) {
      const date = new Date(2024, 9, day); // October data
      data.push({
        ts: date.getTime(),
        values: { elapsed_time: 2 + Math.random() * 3 },
      });
    }
    const currentDate = new Date();
    for (let day = 1; day <= currentDate.getDate(); day++) {
      const date = new Date(2024, 10, day); // November data
      if (date <= currentDate) {
        data.push({
          ts: date.getTime(),
          values: { elapsed_time: 2 + Math.random() * 3 },
        });
      }
    }
    return data;
  };

  // Initialize historical data
  useEffect(() => {
    setHistoricalData(generateHistoricalData());
  }, []);

  // Filter module completion data
  useEffect(() => {
    let filteredData = [...historicalData];
    if (dataFilter === DataFilter.NOVEMBER) {
      filteredData = historicalData.filter((entry) => {
        const entryDate = new Date(entry.ts);
        return entryDate.getMonth() === 10 && entryDate.getFullYear() === 2024;
      });
    } else if (dataFilter === DataFilter.LAST_MONTH) {
      filteredData = historicalData.filter((entry) => {
        const entryDate = new Date(entry.ts);
        return entryDate.getMonth() === 9 && entryDate.getFullYear() === 2024;
      });
    }
    filteredData.sort((a, b) => a.ts - b.ts);
    setProgressData(filteredData);
  }, [dataFilter, historicalData]);

  return (
    <Layout>
      <div className="flex flex-col items-center pb-6">
        <div className="w-full mb-8">
          <PatientDetails childId={id} />
        </div>
        <div className="mb-6 relative flex justify-center gap-4">
          <select
            value={viewOption}
            onChange={(e) => setViewOption(e.target.value as ViewOptionType)}
            className="w-56 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            <option value={ViewOptions.WORD_FREQUENCY}>Word Frequency</option>
            <option value={ViewOptions.MODULE_COMPLETION}>Module Completion</option>
          </select>
          {viewOption === ViewOptions.MODULE_COMPLETION && (
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
          )}
        </div>
        {viewOption === ViewOptions.WORD_FREQUENCY && (
          <div className="grid grid-cols-2 gap-6 w-full max-w-7xl px-4">
            {Object.entries(filteredData).map(([word, data]) => (
              <div key={word} className="bg-white p-4 shadow rounded-md">
                <h2 className="text-xl mb-4 capitalize">{word} - Elapsed Time</h2>
                <Bar
                  data={{
                    labels: data.map((entry) =>
                      new Date(entry.ts).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    ),
                    datasets: [
                      {
                        label: `Time Taken for ${word} (seconds)`,
                        data: data.map((entry) => entry.value),
                        backgroundColor: "rgba(75, 192, 192, 0.5)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      x: {
                        title: { display: true, text: "Timestamp", font: { size: 14 } },
                      },
                      y: {
                        title: { display: true, text: "Elapsed Time (seconds)", font: { size: 14 } },
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            ))}
          </div>
        )}
        {viewOption === ViewOptions.MODULE_COMPLETION && (
          <div className="h-[600px] bg-white p-8 rounded-lg shadow w-full max-w-7xl">
            <Line
              data={{
                labels: progressData.map((entry) =>
                  new Date(entry.ts).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                ),
                datasets: [
                  {
                    label: "Elapsed Time (minutes)",
                    data: progressData.map((entry) => entry.values.elapsed_time * 10),
                    borderColor: "rgba(135, 206, 235, 0.8)",
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    pointBackgroundColor: progressData.map((entry) => {
                      const elapsedTime = entry.values.elapsed_time * 10;
                      if (elapsedTime <= 30) return "rgba(0, 128, 0, 1)";
                      if (elapsedTime <= 40) return "rgba(0, 0, 255, 1)";
                      return "rgba(255, 0, 0, 1)";
                    }),
                    pointBorderColor: progressData.map((entry) => {
                      const elapsedTime = entry.values.elapsed_time * 10;
                      if (elapsedTime <= 30) return "rgba(0, 128, 0, 1)";
                      if (elapsedTime <= 40) return "rgba(0, 0, 255, 1)";
                      return "rgba(255, 0, 0, 1)";
                    }),
                    pointRadius: 4,
                    pointHoverRadius: 8,
                    pointBorderWidth: 2,
                    pointStyle: "circle",
                    order: 1,
                    fill: false,
                    borderWidth: 2,
                    tension: 0.3,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: { display: true, text: "Date", font: { size: 16 } },
                    ticks: { maxRotation: 45, minRotation: 45 },
                  },
                  y: {
                    title: { display: true, text: "Elapsed Time (minutes)", font: { size: 16 } },
                    beginAtZero: true,
                  },
                },
                plugins: {
                  tooltip: {
                    enabled: true,
                    mode: "index",
                    intersect: false,
                  },
                  legend: {
                    display: true,
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PatientPage;
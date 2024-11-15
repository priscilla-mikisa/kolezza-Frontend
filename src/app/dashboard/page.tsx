"use client";
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useFetchTherapists } from '../components/hooks/useFetchTherapists';
import { useFetchChildren } from '../components/hooks/useFetchChildren';
import Layout from '../Layout';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartOptions} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels);

const Dashboard: React.FC = () => {
  const { length: tLength, weeklyCount: tWeekly, monthlyCount: tMonthly, activeCount: tActive } = useFetchTherapists();
  const { length: cLength, weeklyCount: cWeekly, monthlyCount: cMonthly, activeCount: cActive } = useFetchChildren();

  const [therapistsFilter, setTherapistsFilter] = useState<string>('active');
  const [childrenFilter, setChildrenFilter] = useState<string>('active');
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const dummyTherapistsData = {
    active: [0, 0, 0, 0, 0, 0, 0, 0, 150, 180, 0, 0],
    weekly: [0, 0, 0, 0, 0, 0, 0, 0, 120, 140, 0, 0],
    monthly: [0, 0, 0, 0, 0, 0, 0, 0, 200, 220, 0, 0]
  };

  const dummyChildrenData = {
    active: [0, 0, 0, 0, 0, 0, 0, 0, 280, 320, 0, 0],
    weekly: [0, 0, 0, 0, 0, 0, 0, 0, 230, 260, 0, 0],
    monthly: [0, 0, 0, 0, 0, 0, 0, 0, 350, 380, 0, 0]
  };

  useEffect(() => {
    const dummyTotalTherapists = 250;
    const dummyTotalChildren = 450;
    setTotalUsers((tLength || dummyTotalTherapists) + (cLength || dummyTotalChildren));
  }, [tLength, cLength]);

  const donutData =  {
    labels: ['Therapists', 'Children'],
    datasets: [
      {
        data: [tLength || 250, cLength || 450],
        backgroundColor: ['#4CAF50', '#052049'],
        borderWidth: 0,
      },
    ],
  };

  type CustomTooltipContext = {
    chart: {
      data: {
        labels?: unknown[]; 
      };
    };
    dataIndex: number;
  };

  const donutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: '#000',
        anchor: 'end',
        align: 'end',
        offset: 8,
        font: {
          size: 14,
          weight: 'bold',
          family: "'Inter', sans-serif",
        },
        formatter: (value: number, context: CustomTooltipContext) => {
          const labels = context.chart.data.labels as string[]; 
          const label = labels?.[context.dataIndex] || '';
          return `${label}: ${value}`;
        },  
      },
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          font: {
            size: 16,
            family: "'Inter', sans-serif",
            weight: 'bold',
          },
          color: '#333',
          padding: 28,
          boxWidth: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    cutout: '70%',
  };
  
  
  const getTherapistsData = () => {
    if (tActive || tWeekly || tMonthly) {
      return therapistsFilter === 'active' ? Array(12).fill(tActive)
           : therapistsFilter === 'weekly' ? Array(12).fill(tWeekly)
           : Array(12).fill(tMonthly);
    } else {
      return therapistsFilter === 'active' ? dummyTherapistsData.active
           : therapistsFilter === 'weekly' ? dummyTherapistsData.weekly
           : dummyTherapistsData.monthly;
    }
  };

  const getChildrenData = () => {
    if (cActive || cWeekly || cMonthly) {
      return childrenFilter === 'active' ? Array(12).fill(cActive)
           : childrenFilter === 'weekly' ? Array(12).fill(cWeekly)
           : Array(12).fill(cMonthly);
    } else {
      return childrenFilter === 'active' ? dummyChildrenData.active
           : childrenFilter === 'weekly' ? dummyChildrenData.weekly
           : dummyChildrenData.monthly;
    }
  };

  const barDataTherapists = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Therapists',
        data: getTherapistsData(),
        backgroundColor: '#4CAF50',
        borderRadius: 4,
        barThickness: 16,
      },
    ],
  };

  const barDataChildren = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Children',
        data: getChildrenData(),
        backgroundColor: '#052049',
        borderRadius: 4,
        barThickness: 16,
      },
    ],
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        color: '#FFFFFF',
        anchor: 'center' as const, // Explicitly set to "center" as required
        align: 'center' as const,
        font: {
          weight: 'bold',
          size: 12,
        },
        formatter: (value: number) => {
          return value > 0 ? value : ''; 
        },
        padding: {
          top: 0,
          bottom: 0,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
          font: {
            size: 16,
            weight: 'bold',
          },
          color: '#333',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Users',
          font: {
            size: 16,
            weight: 'bold',
          },
          color: '#333',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Layout>
      <div className="flex flex-col items-center min-h-screen bg-white px-12 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-16">All Users</h1>

        <div className="relative w-full max-w-md mb-20">
          <div className="relative h-80">
            <Doughnut data={donutData} options={donutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-4xl font-bold text-gray-900 mt-1">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
          <div className="bg-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Therapists</h2>
              <select
                className="border border-gray-200 px-4 py-1.5 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={therapistsFilter}
                onChange={(e) => setTherapistsFilter(e.target.value)}
              >
                <option value="active">Active Users</option>
                <option value="weekly">Weekly Users</option>
                <option value="monthly">Monthly Users</option>
              </select>
            </div>
            <div className="h-80">
              <Bar data={barDataTherapists} options={barOptions} />
            </div>
          </div>

          <div className="bg-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Children</h2>
              <select
                className="border border-gray-200 px-4 py-1.5 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={childrenFilter}
                onChange={(e) => setChildrenFilter(e.target.value)}
              >
                <option value="active">Active Users</option>
                <option value="weekly">Weekly Users</option>
                <option value="monthly">Monthly Users</option>
              </select>
            </div>
            <div className="h-80">
              <Bar data={barDataChildren} options={barOptions} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

// "use client";
// import React, { useState, useEffect } from 'react';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
// import { Doughnut, Bar } from 'react-chartjs-2';
// import { useFetchTherapists } from '../hooks/useFetchTherapists';
// import { useFetchChildren } from '../hooks/useFetchChildren';
// import Layout from '../Layout';
// import ChartDataLabels from 'chartjs-plugin-datalabels';

// ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels);

// const Dashboard: React.FC = () => {
//   const { length: tLength, weeklyCount: tWeekly, monthlyCount: tMonthly, activeCount: tActive } = useFetchTherapists();
//   const { length: cLength, weeklyCount: cWeekly, monthlyCount: cMonthly, activeCount: cActive } = useFetchChildren();

//   const [therapistsFilter, setTherapistsFilter] = useState<string>('active');
//   const [childrenFilter, setChildrenFilter] = useState<string>('active');
//   const [totalUsers, setTotalUsers] = useState<number>(0);

//   const dummyTherapistsData = {
//     active: [0, 0, 0, 0, 0, 0, 0, 0, 150, 180, 0, 0],
//     weekly: [0, 0, 0, 0, 0, 0, 0, 0, 120, 140, 0, 0],
//     monthly: [0, 0, 0, 0, 0, 0, 0, 0, 200, 220, 0, 0]
//   };

//   const dummyChildrenData = {
//     active: [0, 0, 0, 0, 0, 0, 0, 0, 280, 320, 0, 0],
//     weekly: [0, 0, 0, 0, 0, 0, 0, 0, 230, 260, 0, 0],
//     monthly: [0, 0, 0, 0, 0, 0, 0, 0, 350, 380, 0, 0]
//   };

//   useEffect(() => {
//     const dummyTotalTherapists = 250;
//     const dummyTotalChildren = 450;
//     setTotalUsers((tLength || dummyTotalTherapists) + (cLength || dummyTotalChildren));
//   }, [tLength, cLength]);

//   const donutData = {
//     labels: ['Therapists', 'Children'],
//     datasets: [
//       {
//         data: [tLength || 250, cLength || 450],
//         backgroundColor: ['#4CAF50', '#052049'],
//         borderWidth: 0,
//       },
//     ],
//   };

//   const donutOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       datalabels: {
//         color: '#000',
//         anchor: 'end',
//         align: 'end',
//         offset: 8,
//         font: {
//           size: 14,
//           weight: 'bold',
//           family: "'Inter', sans-serif",
//         },
//         formatter: (value: number, context: { chart: { data: { labels: { [x: string]: string; }; }; }; dataIndex: string | number; }) => {
//           const label = context.chart.data.labels[context.dataIndex];
//           return `${label}: ${value}`;
//         },
//       },
//       legend: {
//         display: true,
//         position: 'bottom' as const, 
//         labels: {
//           font: {
//             size: 16,
//             family: "'Inter', sans-serif",
//             weight: 'bold',
//           },
//           color: '#333',
//           padding: 28,
//           boxWidth: 20,
//           usePointStyle: true,
//         },
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//     cutout: '70%',
//   };

//   const getTherapistsData = () => {
//     if (tActive || tWeekly || tMonthly) {
//       return therapistsFilter === 'active' ? Array(12).fill(tActive)
//            : therapistsFilter === 'weekly' ? Array(12).fill(tWeekly)
//            : Array(12).fill(tMonthly);
//     } else {
//       return therapistsFilter === 'active' ? dummyTherapistsData.active
//            : therapistsFilter === 'weekly' ? dummyTherapistsData.weekly
//            : dummyTherapistsData.monthly;
//     }
//   };

//   const getChildrenData = () => {
//     if (cActive || cWeekly || cMonthly) {
//       return childrenFilter === 'active' ? Array(12).fill(cActive)
//            : childrenFilter === 'weekly' ? Array(12).fill(cWeekly)
//            : Array(12).fill(cMonthly);
//     } else {
//       return childrenFilter === 'active' ? dummyChildrenData.active
//            : childrenFilter === 'weekly' ? dummyChildrenData.weekly
//            : dummyChildrenData.monthly;
//     }
//   };

//   const barDataTherapists = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
//     datasets: [
//       {
//         label: 'Therapists',
//         data: getTherapistsData(),
//         backgroundColor: '#4CAF50',
//         borderRadius: 4,
//         barThickness: 16,
//       },
//     ],
//   };

//   const barDataChildren = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
//     datasets: [
//       {
//         label: 'Children',
//         data: getChildrenData(),
//         backgroundColor: '#052049',
//         borderRadius: 4,
//         barThickness: 16,
//       },
//     ],
//   };

//   const barOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: true,
//         position: 'top' as const, // Ensure 'position' is typed correctly
//       },
//       tooltip: {
//         enabled: true,
//       },
//       datalabels: {
//         color: '#FFFFFF',
//         anchor: 'center',
//         align: 'center',
//         font: {
//           weight: 'bold',
//           size: 12,
//         },
//         formatter: (value: number) => {
//           return value > 0 ? value : '';
//         },
//         padding: {
//           top: 0,
//           bottom: 0,
//         },
//       },
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: 'Months',
//           font: {
//             size: 16,
//             weight: 'bold',
//           },
//           color: '#333',
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'Number of Users',
//           font: {
//             size: 16,
//             weight: 'bold',
//           },
//           color: '#333',
//         },
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     <Layout>
//       <div className="flex flex-col items-center min-h-screen bg-white px-12 py-8">
//         <h1 className="text-2xl font-semibold text-gray-900 mb-16">All Users</h1>

//         <div className="relative w-full max-w-md mb-20">
//           <div className="relative h-80">
//             <Doughnut data={donutData} options={donutOptions} />
//             <div className="absolute inset-0 flex flex-col items-center justify-center">
//               <p className="text-sm font-medium text-gray-600">Total Users</p>
//               <p className="text-4xl font-bold text-gray-900 mt-1">{totalUsers}</p>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
//           <div className="bg-white">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-lg font-semibold text-gray-900">Therapists</h2>
//               <select
//                 className="border border-gray-200 px-4 py-1.5 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={therapistsFilter}
//                 onChange={(e) => setTherapistsFilter(e.target.value)}
//               >
//                 <option value="active">Active Users</option>
//                 <option value="weekly">Weekly Users</option>
//                 <option value="monthly">Monthly Users</option>
//               </select>
//             </div>
//             <Bar data={barDataTherapists} options={barOptions} />
//           </div>

//           <div className="bg-white">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-lg font-semibold text-gray-900">Children</h2>
//               <select
//                 className="border border-gray-200 px-4 py-1.5 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={childrenFilter}
//                 onChange={(e) => setChildrenFilter(e.target.value)}
//               >
//                 <option value="active">Active Users</option>
//                 <option value="weekly">Weekly Users</option>
//                 <option value="monthly">Monthly Users</option>
//               </select>
//             </div>
//             <Bar data={barDataChildren} options={barOptions} />
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Dashboard;
